import { defineStore } from 'pinia';
import api, { getCsrfCookie } from '@/api/api';
import router from '@/router';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null,
        loading: false,
        error: null,
        verificationEmail: null,
        initialized: false,
        courses: [] // Add courses state
    }),

    getters: {
        isAuthenticated: (state) => !!state.user,
        userRole: (state) => state.user?.role,
        // Add getter for available courses
        availableCourses: (state) => state.courses
    },

    actions: {
        async initialize() {
            if (this.initialized) return;
            
            try {
                this.loading = true;
                await getCsrfCookie();
                await this.fetchUser();
            } catch (error) {
                console.log('No active session found');
            } finally {
                this.initialized = true;
                this.loading = false;
            }
        },

        async fetchUser() {
            try {
                const response = await api.get('/auth/me', {
                    _skipAuth: true 
                });
                this.user = response.data;
                this.error = null;
                return response.data;
            } catch (error) {
                this.user = null;
                if (error.response?.status !== 401) {
                    this.error = error.response?.data?.message || 'Failed to fetch user data';
                    throw error;
                }
            }
        },

        // Fetch available courses for registration
        async fetchCourses() {
            try {
                const response = await api.get('/auth/courses', {
                    _skipAuth: true
                });
                this.courses = response.data;
                return response.data;
            } catch (error) {
                console.error('Failed to fetch courses:', error);
                this.courses = [];
                throw error;
            }
        },

        async register(userData) {
            try {
                await getCsrfCookie();
                this.loading = true;
                this.error = null;
                
                const response = await api.post('/auth/register', {
                    name: userData.name,
                    email: userData.email,
                    reg_number: userData.reg_number,
                    course_id: userData.course_id, // ADD COURSE ID
                    password: userData.password,
                    password_confirmation: userData.password_confirmation,
                });
                
                return response.data;
            } catch (error) {
                if (error.response) {
                    if (error.response.status === 422) {
                        // Validation errors - pass through for form handling
                        throw error;
                    }
                    throw new Error(error.response.data.message || 'Registration failed');
                }
                throw new Error('Network error during registration');
            } finally {
                this.loading = false;
            }
        },

        async login(credentials) {
            try {
                await getCsrfCookie();
                this.loading = true;
                this.error = null;
                
                const response = await api.post('/auth/login', {
                    email: credentials.email,
                    password: credentials.password,
                    remember: credentials.remember || false
                });

                this.user = response.data;
                
                // Also fetch fresh data to ensure consistency
                await this.fetchUser();
                
            } catch (error) {
                this.user = null;
                
                if (error.response) {
                    if (error.response.status === 401 || error.response.status === 422) {
                        this.error = 'Invalid email or password';
                    } else if (error.response.status === 403) {
                        this.error = 'Please verify your email address';
                    } else if (error.response.status === 429) {
                        this.error = 'Too many login attempts. Please try again later.';
                    } else {
                        this.error = error.response.data.message || 'Login failed';
                    }
                } else {
                    this.error = 'Network error during login';
                }
                
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async logout() {
            try {
                this.loading = true;
                await api.post('/auth/logout', {}, {
                    _skipAuth: true 
                });
            } catch (error) {
                console.error('Logout API error:', error);
            } finally {
                this.user = null;
                this.verificationEmail = null;
                this.error = null;
                this.initialized = false;
                this.loading = false;
                
                router.push({ name: 'Login' });
            }
        }
    }
});