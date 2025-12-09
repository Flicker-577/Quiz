<template>
  <div class="table-wrapper">
    <div class="table-responsive">
      <table :class="['table', { 'table-striped': striped, 'table-hover': hover }]">
        <thead>
          <tr>
            <th 
              v-for="column in columns" 
              :key="column.key"
              :style="{ width: column.width }"
              :class="[column.align ? `text-${column.align}` : 'text-left']"
            >
              <slot :name="`header-${column.key}`" :column="column">
                {{ column.label }}
              </slot>
            </th>
            <th v-if="$slots.actions || hasActions" class="text-right">Actions</th>
          </tr>
        </thead>
        
        <tbody v-if="!loading && data.length > 0">
          <tr 
            v-for="(item, index) in data" 
            :key="item.id || index"
            @click="handleRowClick(item)"
            :class="{ 'clickable': rowClickable }"
          >
            <td 
              v-for="column in columns" 
              :key="column.key"
              :class="[column.align ? `text-${column.align}` : 'text-left']"
            >
              <slot 
                :name="column.key" 
                :item="item" 
                :value="item[column.key]" 
                :index="index"
              >
                {{ item[column.key] }}
              </slot>
            </td>
            
            <td v-if="$slots.actions || hasActions" class="text-right action-cell">
              <slot name="actions" :item="item" :index="index" />
            </td>
          </tr>
        </tbody>

        <tbody v-if="loading">
          <tr v-for="n in 5" :key="n" class="skeleton-row">
            <td :colspan="columns.length + ($slots.actions ? 1 : 0)">
              <div class="skeleton-bar"></div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="!loading && data.length === 0" class="empty-state">
      <div class="empty-icon">
        <svg viewBox="0 0 24 24" width="48" height="48" stroke="currentColor" fill="none" stroke-width="1">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
          <polyline points="10 9 9 9 8 9"></polyline>
        </svg>
      </div>
      <p>No data found</p>
    </div>

    <div v-if="$slots.footer" class="table-footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'AppTable',
  props: {
    columns: {
      type: Array,
      required: true
      // Expected format: [{ key: 'status', label: 'Status', width: '100px', align: 'center' }]
    },
    data: {
      type: Array,
      default: () => []
    },
    striped: Boolean,
    hover: Boolean,
    loading: Boolean,
    rowClickable: Boolean
  },
  computed: {
    hasActions() {
      return !!this.$slots.actions
    }
  },
  methods: {
    handleRowClick(item) {
      if (this.rowClickable) {
        this.$emit('row-click', item)
      }
    }
  }
}
</script>

<style scoped>
.table-wrapper {
  background: white;
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
  border: 1px solid var(--gray-light);
  display: flex;
  flex-direction: column;
}

.table-responsive {
  overflow-x: auto;
  width: 100%;
}

.table {
  width: 100%;
  border-collapse: collapse; /* Required for borders to look right */
  margin: 0;
}

/* --- Header Styling --- */
.table thead th {
  background: var(--light-color);
  color: var(--gray-dark);
  font-weight: 600;
  font-size: 0.85rem;
  text-transform: uppercase;
  padding: var(--spacing-md) var(--spacing-lg);
  border-bottom: 2px solid var(--gray-light);
  white-space: nowrap;
  letter-spacing: 0.5px;
}

/* --- Body Styling --- */
.table tbody td {
  padding: var(--spacing-md) var(--spacing-lg);
  color: var(--dark-color);
  border-bottom: 1px solid var(--gray-light);
  vertical-align: middle;
  font-size: var(--font-size-sm);
  transition: background-color 0.2s ease;
}

/* Last row border removal */
.table tbody tr:last-child td {
  border-bottom: none;
}

/* Striped & Hover variants */
.table-striped tbody tr:nth-child(odd) {
  background-color: #f8fafc; /* Very subtle gray */
}

.table-hover tbody tr:hover {
  background-color: var(--primary-soft);
}

.clickable {
  cursor: pointer;
}

/* --- Utilities --- */
.text-left { text-align: left; }
.text-center { text-align: center; }
.text-right { text-align: right; }

/* --- Empty State --- */
.empty-state {
  padding: var(--spacing-xl);
  text-align: center;
  color: var(--gray-color);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
}

.empty-icon {
  color: var(--gray-light);
  margin-bottom: var(--spacing-xs);
}

/* --- Skeleton Loader --- */
.skeleton-bar {
  height: 20px;
  width: 100%;
  background: linear-gradient(90deg, var(--gray-light) 25%, #f0f0f0 50%, var(--gray-light) 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 4px;
  opacity: 0.5;
}

@keyframes loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* --- Footer --- */
.table-footer {
  padding: var(--spacing-md) var(--spacing-lg);
  border-top: 1px solid var(--gray-light);
  background: #fcfcfc;
}
</style>