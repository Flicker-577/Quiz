import axios from 'axios';
import { useAuthStore } from '@/stores/authStore';

// Base URLs from environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

// Axios instance for your main API calls (use this everywhere)
const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true, // ensures cookies (session & XSRF-TOKEN) are sent
    xsrfCookieName: 'XSRF-TOKEN',
    xsrfHeaderName: 'X-XSRF-TOKEN',
});

// Single-flight CSRF request: multiple callers share one underlying network request.
let _csrfPromise = null;

export async function getCsrfCookie() {
    // If there is already a pending csrf request, reuse it
    if (_csrfPromise) {
        return _csrfPromise;
    }

    // Start the request and store the promise
    _csrfPromise = axios
        .get(`${BACKEND_URL}/sanctum/csrf-cookie`, { 
            withCredentials: true,
            baseURL: '' // Override baseURL for this specific call
        })
        .then(response => {
            // Ensure the XSRF token is properly set in the main api instance
            const token = getCookieValue('XSRF-TOKEN');
            if (token) {
                api.defaults.headers.common['X-XSRF-TOKEN'] = decodeURIComponent(token);
            }
            return response;
        })
        .finally(() => {
            // Clear the promise after a short delay to allow concurrent requests to reuse it
            setTimeout(() => { _csrfPromise = null; }, 100);
        });

    return _csrfPromise;
}

function getCookieValue(name) {
    const value = `; ${document.cookie || ''}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

// Request interceptor to add CSRF token
api.interceptors.request.use(
    async (config) => {
        // Skip CSRF for external URLs or if already set
        if (config.url.includes('/sanctum/csrf-cookie') || config._skipCsrf) {
            return config;
        }

        // Ensure we have a CSRF token
        const token = getCookieValue('XSRF-TOKEN');
        if (!token) {
            await getCsrfCookie();
        } else {
            config.headers['X-XSRF-TOKEN'] = decodeURIComponent(token);
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for handling auth errors
let isRefreshing = false;
let refreshSubscribers = [];

api.interceptors.response.use(
    response => response,
    async error => {
        const { config, response } = error;
        const authStore = useAuthStore();
        
        // Skip handling for public routes or special cases
        if (!config || config.url.includes('/sanctum/csrf-cookie') || config._skipAuth) {
            return Promise.reject(error);
        }

        // Handle 401 Unauthorized
        if (response?.status === 401 && !config._retry) {
            config._retry = true;
            
            if (!isRefreshing) {
                isRefreshing = true;
                
                try {
                    // Attempt to refresh CSRF and session
                    await getCsrfCookie();
                    await authStore.fetchUser();
                    
                    // Retry all queued requests
                    refreshSubscribers.forEach(cb => cb());
                    refreshSubscribers = [];
                    
                    // Retry the original request
                    return api(config);
                } catch (refreshError) {
                    // Final logout on refresh failure
                    authStore.logout();
                    return Promise.reject(refreshError);
                } finally {
                    isRefreshing = false;
                }
            }
            
            // Queue requests during refresh
            return new Promise((resolve) => {
                refreshSubscribers.push(() => resolve(api(config)));
            });
        }

        // Handle 419 CSRF token mismatch
        if (response?.status === 419) {
            try {
                await getCsrfCookie();
                return api(config);
            } catch (csrfError) {
                authStore.logout();
                return Promise.reject(csrfError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;