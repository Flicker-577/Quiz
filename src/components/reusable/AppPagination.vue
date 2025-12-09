<template>
  <div v-if="meta && meta.last_page > 1" class="pagination-container">
    <button 
      class="pagination-btn" 
      :disabled="!meta.prev_page_url" 
      @click="$emit('change', meta.current_page - 1)"
    >
      Previous
    </button>
    
    <span class="pagination-info">
      Page {{ meta.current_page }} of {{ meta.last_page }}
    </span>
    
    <button 
      class="pagination-btn" 
      :disabled="!meta.next_page_url" 
      @click="$emit('change', meta.current_page + 1)"
    >
      Next
    </button>
  </div>
</template>

<script>
export default {
  name: 'AppPagination',
  props: {
    // Expects the standard Laravel Paginator object (without the 'data' key)
    meta: {
      type: Object,
      required: true,
      default: () => ({
        current_page: 1,
        last_page: 1,
        prev_page_url: null,
        next_page_url: null
      })
    }
  },
  emits: ['change']
}
</script>

<style scoped>
.pagination-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid #eee;
}

.pagination-btn {
  padding: 6px 14px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: white;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s;
}

.pagination-btn:hover:not(:disabled) {
  background-color: #f3f4f6;
  border-color: #ccc;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background-color: #f9fafb;
}

.pagination-info {
  font-size: 0.9rem;
  color: #374151;
  font-weight: 500;
}
</style>