<template>
  <AppModal 
    :show="show" 
    :title="module?.name" 
    width="700px" 
    @close="$emit('close')"
  >
    <div v-if="module" class="modal-content-scroll">
      
      <div class="modal-stats-row">
        <div class="modal-stat-item">
          <span class="label">Lecturer</span>
          <span class="value">{{ module.lecturer_name }}</span>
        </div>
        <div class="modal-stat-item">
          <span class="label">Total Notes</span>
          <span class="value">{{ module.notesCount }}</span>
        </div>
        <div class="modal-stat-item">
          <span class="label">Total Quizzes</span>
          <span class="value">{{ module.quizCount }}</span>
        </div>
      </div>
      
      <div class="modal-tabs-wrapper">
        <button 
          :class="['tab-btn', { active: activeTab === 'notes' }]"
          @click="activeTab = 'notes'"
        >
          Notes
        </button>
        <button 
          :class="['tab-btn', { active: activeTab === 'quizzes' }]"
          @click="activeTab = 'quizzes'"
        >
          Quizzes
        </button>
      </div>
      
      <div class="tab-content-area">
        <div v-if="activeTab === 'notes'">
          <AppTable :columns="noteColumns" :data="currentModuleNotes" hover>
            <template #title="{ item }">
              <div class="file-cell">
                <div class="file-icon-sm" :data-type="getFileExtension(item.file_url)">
                  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none" stroke-width="2"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><polyline points="13 2 13 9 20 9"></polyline></svg>
                </div>
                <span class="file-name">{{ item.title }}</span>
              </div>
            </template>
            <template #actions>
              <div class="action-group-student">
                <AppButton variant="outline" size="sm">
                  <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" fill="none" stroke-width="2" class="btn-icon"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                  Download
                </AppButton>
              </div>
            </template>
          </AppTable>
          <div v-if="currentModuleNotes.length === 0" class="empty-state-card-sm">
            <p>No notes have been uploaded for this module yet.</p>
          </div>
        </div>
        
        <div v-if="activeTab === 'quizzes'">
          <AppTable :columns="quizColumns" :data="currentModuleQuizzes" hover>
            <template #title="{ item }">
              <span class="quiz-title">{{ item.title }}</span>
            </template>
            <template #status="{ item }">
              <span class="status-badge" :class="item.status">{{ item.status }}</span>
            </template>
          </AppTable>
           <div v-if="currentModuleQuizzes.length === 0" class="empty-state-card-sm">
            <p>No quizzes are available for this module yet.</p>
          </div>
        </div>
      </div>
    </div>
  </AppModal>
</template>

<script>
import { ref, watch } from 'vue'
import AppButton from '../reusable/AppButton.vue'
import AppModal from '../reusable/AppModal.vue'
import AppTable from '../reusable/AppTable.vue'

export default {
  name: "ModuleDetailModal",
  components: { AppButton, AppModal, AppTable },
  props: {
    show: Boolean,
    module: Object
  },
  emits: ['close'],
  setup(props) {
    const activeTab = ref('notes')
    const currentModuleNotes = ref([])
    const currentModuleQuizzes = ref([])

    // UPDATED: 'actions' key removed
    const noteColumns = [
      { key: 'title', label: 'Note Title', width: '70%' },
    ]
    // UPDATED: 'actions' key removed, title width adjusted
    const quizColumns = [
      { key: 'title', label: 'Quiz Title', width: '70%' },
      { key: 'status', label: 'Status' },
    ]
    
    watch(() => props.module, (newModule) => {
      if (newModule) {
        activeTab.value = 'notes';
        
        const allNotes = [
          { id: 1, module_id: 1, title: 'Lecture 1: Intro to HTML', file_url: 'note1.pdf' },
          { id: 2, module_id: 1, title: 'Lecture 2: CSS Basics', file_url: 'note2.pdf' },
          { id: 3, module_id: 2, title: 'DB Note 1: SQL Joins', file_url: 'note3.pdf' },
          { id: 4, module_id: 1, title: 'Lecture 3: JavaScript', file_url: 'note4.pdf' },
        ];
        
        const allQuizzes = [
          { id: 1, module_id: 1, title: 'Quiz 1: HTML Basics', status: 'active', duration_minutes: 10 },
          { id: 2, module_id: 1, title: 'Quiz 2: CSS', status: 'active', duration_minutes: 15 },
          { id: 3, module_id: 2, title: 'DB Quiz 1', status: 'closed', duration_minutes: 20 },
        ];

        currentModuleNotes.value = allNotes.filter(n => n.module_id === newModule.id);
        currentModuleQuizzes.value = allQuizzes.filter(q => q.module_id === newModule.id);
      }
    })
    
    const getFileExtension = (filename) => {
      if (!filename) return 'FILE'
      return filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2).toUpperCase()
    }

    return {
      activeTab,
      currentModuleNotes,
      currentModuleQuizzes,
      noteColumns,
      quizColumns,
      getFileExtension
    }
  }
}
</script>

<style scoped>
/* Styles for inside the modal */
.modal-content-scroll {
  max-height: 65vh;
  overflow-y: auto;
  padding: 5px; 
  margin: -5px; 
}
.modal-stats-row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  background: var(--light-color);
  border: 1px solid var(--gray-light);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
}
.modal-stat-item { text-align: center; }
.modal-stat-item .label {
  font-size: 0.8rem;
  color: var(--gray-color);
  display: block;
}
.modal-stat-item .value {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--dark-color);
  display: block;
}
.modal-tabs-wrapper {
  display: flex; gap: var(--spacing-md);
  border-bottom: 1px solid var(--gray-light);
  margin-bottom: var(--spacing-lg);
}
.tab-btn {
  background: none; border: none; padding: var(--spacing-md) var(--spacing-sm);
  font-size: 1rem; color: var(--gray-color); font-weight: 500; cursor: pointer;
  border-bottom: 3px solid transparent; transition: all 0.2s;
}
.tab-btn:hover { color: var(--dark-color); }
.tab-btn.active { color: var(--primary-color); border-bottom-color: var(--primary-color); }
.file-cell { display: flex; align-items: center; gap: var(--spacing-sm); }
.file-icon-sm {
  width: 28px; height: 28px; border-radius: 6px; background: var(--gray-light);
  display: flex; align-items: center; justify-content: center; color: var(--gray-dark);
  flex-shrink: 0;
}
.file-icon-sm[data-type="PDF"] { background: #ef4444; color: white; }
.file-name { font-weight: 500; color: var(--dark-color); }
.quiz-title { font-weight: 500; color: var(--dark-color); }
.status-badge {
  font-size: 0.75rem; font-weight: 600; padding: 3px 8px;
  border-radius: 4px; text-transform: uppercase;
}
.status-badge.active { background: var(--success-soft); color: var(--success-dark); }
.status-badge.closed { background: var(--danger-soft); color: var(--danger-dark); }
.action-group-student { display: flex; justify-content: flex-end; }
.btn-icon { margin-right: 6px; }

.empty-state-card-sm {
  text-align: center;
  padding: var(--spacing-lg);
  background: var(--light-color);
  border: 1px dashed var(--gray-light);
  border-radius: var(--border-radius-md);
  color: var(--gray-color);
  margin-top: var(--spacing-sm);
}

@media (max-width: 768px) {
  .modal-stats-row { grid-template-columns: 1fr; gap: var(--spacing-md); text-align: left; }
}
</style>