import { defineStore } from 'pinia';
import api from '@/api/api';

export const useQuizStore = defineStore('quiz', {
    state: () => ({
        quizzes: [],
        currentQuiz: null,
        loading: false,
        error: null
    }),

    getters: {
        // Helper to count drafts, active, etc.
        draftCount: (state) => state.quizzes.filter(q => q.status === 'draft').length,
        publishedCount: (state) => state.quizzes.filter(q => q.status === 'published').length,
        // Calculate average score if you have that data, otherwise return placeholder
        averageScore: (state) => 0 
    },

    actions: {
        /**
         * Fetch all quizzes
         * @param {Object} params - filters like { module_id, status, search }
         */
        async fetchQuizzes(params = {}) {
            this.loading = true;
            this.error = null;
            try {
                const response = await api.get('/lecturer/quizzes', { params });
                this.quizzes = response.data;
                return response.data;
            } catch (err) {
                this.error = err.response?.data?.message || 'Failed to fetch quizzes';
                console.error(err);
                throw err;
            } finally {
                this.loading = false;
            }
        },

        /**
         * Fetch a single quiz details
         */
        async fetchQuiz(id) {
            this.loading = true;
            try {
                const response = await api.get(`/lecturer/quizzes/${id}`);
                this.currentQuiz = response.data;
                return response.data;
            } catch (err) {
                console.error(err);
                throw err;
            } finally {
                this.loading = false;
            }
        },

        /**
         * Create a new quiz
         */
        async createQuiz(quizData) {
            this.loading = true;
            try {
                const response = await api.post('/lecturer/quizzes', quizData);
                // Add to local state immediately to avoid refetch
                this.quizzes.unshift(response.data.quiz); 
                return response.data.quiz;
            } catch (err) {
                this.error = err.response?.data?.message || 'Failed to create quiz';
                throw err;
            } finally {
                this.loading = false;
            }
        },

        /**
         * Update quiz details
         */
        async updateQuiz(id, data) {
            this.loading = true;
            try {
                const response = await api.put(`/lecturer/quizzes/${id}`, data);
                // Update local state
                const index = this.quizzes.findIndex(q => q.id === id);
                if (index !== -1) {
                    this.quizzes[index] = { ...this.quizzes[index], ...response.data.quiz };
                }
                return response.data.quiz;
            } catch (err) {
                throw err;
            } finally {
                this.loading = false;
            }
        },

        /**
         * Publish a quiz
         */
        async publishQuiz(id, settings) {
            this.loading = true;
            try {
                const response = await api.post(`/lecturer/quizzes/${id}/publish`, settings);
                const index = this.quizzes.findIndex(q => q.id === id);
                if (index !== -1) {
                    this.quizzes[index] = { ...this.quizzes[index], ...response.data.quiz };
                }
                return response.data.quiz;
            } catch (err) {
                throw err;
            } finally {
                this.loading = false;
            }
        },

        /**
         * Toggle status (e.g. revert to draft, close)
         */
        async toggleStatus(id, status) {
            try {
                const response = await api.patch(`/lecturer/quizzes/${id}/status`, { status });
                const index = this.quizzes.findIndex(q => q.id === id);
                if (index !== -1) {
                    this.quizzes[index] = { ...this.quizzes[index], ...response.data.quiz };
                }
                return response.data.quiz;
            } catch (err) {
                throw err;
            }
        },

        /**
         * Delete a quiz
         */
        async deleteQuiz(id) {
            try {
                await api.delete(`/lecturer/quizzes/${id}`);
                this.quizzes = this.quizzes.filter(q => q.id !== id);
            } catch (err) {
                throw err;
            }
        }
    }
});