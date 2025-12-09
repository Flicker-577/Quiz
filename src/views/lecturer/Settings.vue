<template>
  <div class="settings-page">
    <div class="page-header">
      <div>
        <h1 class="page-title">Account Settings</h1>
        <div class="title-decoration"></div><br>
        <p class="page-subtitle">Manage your profile and security</p>
      </div>
      <div class="role-badge" :class="profile.role">
        {{ profile.role }}
      </div>
    </div>

    <div class="settings-tabs">
      <button 
        v-for="tab in tabs" 
        :key="tab.id" 
        :class="['tab-item', { active: currentTab === tab.id }]"
        @click="currentTab = tab.id"
      >
        <span class="tab-icon" v-html="tab.icon"></span>
        {{ tab.label }}
      </button>
    </div>

    <div class="settings-content">
      
      <div v-if="currentTab === 'basic_info'" class="settings-section">
        <div class="card">
          <h3 class="card-subtitle">Personal Details</h3>
          
          <div v-if="loading" class="form-grid single-col">
            <div v-for="i in 3" :key="i" class="form-group">
               <AppSkeleton type="text" width="100px" height="14px" class="mb-1"/>
               <AppSkeleton type="text" width="100%" height="42px" />
            </div>
          </div>

          <form v-else @submit.prevent="askConfirm('profile')" class="form-grid single-col">
            <div class="form-group">
              <label>Full Name</label>
              <input type="text" v-model="profile.name" class="form-input" required>
            </div>
            
            <div class="form-group" v-if="profile.role === 'student'">
              <label>Registration Number</label>
              <input type="text" v-model="profile.reg_number" class="form-input">
            </div>

            <div class="form-group" v-if="profile.department_name">
              <label>Department <span class="badge">Read Only</span></label>
              <input type="text" :value="profile.department_name" class="form-input" disabled>
            </div>

            <div class="form-group">
              <label>Phone Number</label>
              <input type="tel" v-model="profile.phone" class="form-input">
            </div>

            <div class="form-group">
              <label>Email Address <span class="badge">Read Only</span></label>
              <input type="email" :value="profile.email" class="form-input" disabled>
            </div>

            <div class="form-actions">
              <AppButton type="submit" variant="primary">Save Profile</AppButton>
            </div>
          </form>
        </div>
      </div>

      <div v-if="currentTab === 'security'" class="settings-section">
        <div class="card">
          <h3 class="card-subtitle">Change Password</h3>
          
          <form @submit.prevent="askConfirm('password')" class="form-grid single-col">
            <div class="form-group">
              <label>Current Password</label>
              <input type="password" v-model="security.current_password" class="form-input" required>
            </div>
            <div class="form-group">
              <label>New Password</label>
              <input type="password" v-model="security.password" class="form-input" required>
            </div>
            <div class="form-group">
              <label>Confirm New Password</label>
              <input type="password" v-model="security.password_confirmation" class="form-input" required>
            </div>

            <div class="form-actions">
              <AppButton type="submit" variant="primary">Update Password</AppButton>
            </div>
          </form>
        </div>
      </div>
    </div>

    <AppModal 
      v-if="confirm.show" 
      :show="confirm.show" 
      :title="confirm.title" 
      width="450px" 
      @close="confirm.show=false"
    >
       <div class="confirm-content">
        <div v-if="isProcessing" class="spinner-wrapper">
           <AppSpinner size="lg" color="primary" />
           <p>Processing...</p>
        </div>
        <div v-else>
           <div class="icon-wrapper" :class="confirm.type">
             <svg v-if="confirm.type === 'danger'" viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
             <svg v-else viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
           </div>
           <p>{{ confirm.message }}</p>
        </div>
      </div>
      <template #footer>
        <AppButton variant="outline" @click="confirm.show=false" :disabled="isProcessing">Cancel</AppButton>
        <AppButton :variant="confirm.type === 'danger' ? 'danger' : 'primary'" :loading="isProcessing" @click="executeConfirm">
          {{ confirm.btnText }}
        </AppButton>
      </template>
    </AppModal>

    <AppSuccessModal
      :show="success.show"
      :title="success.title"
      :message="success.message"
      @close="success.show = false"
    />

  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import api from '@/api/api' 
import AppButton from '@/components/reusable/AppButton.vue'
import AppSkeleton from '@/components/reusable/AppSkeleton.vue'
import AppModal from '@/components/reusable/AppModal.vue'
import AppSpinner from '@/components/reusable/AppSpinner.vue'
import AppSuccessModal from '@/components/reusable/AppSuccessModal.vue'  
export default {
  name: 'UserSettings',
  components: { AppButton, AppSkeleton, AppModal, AppSpinner, AppSuccessModal },
  setup() {
    // --- State ---
    const currentTab = ref('basic_info')
    const loading = ref(true)
    const isProcessing = ref(false)

    // Data Models
    const profile = reactive({ 
      name: '', 
      reg_number: '', 
      phone: '', 
      email: '', 
      role: '', 
      department_name: '' 
    })
    
    const security = reactive({ 
      current_password: '', 
      password: '', 
      password_confirmation: '' 
    })
    
    // Modal States
    const confirm = ref({ 
      show: false, 
      title: '', 
      message: '', 
      type: 'primary', 
      btnText: 'Confirm', 
      action: null 
    })

    const success = ref({ 
      show: false, 
      title: '', 
      message: '' 
    })

    // Tabs Configuration
    const tabs = [
      { id: 'basic_info', label: 'Profile Details', icon: '<svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" fill="none" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>' },
      { id: 'security', label: 'Security', icon: '<svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" fill="none" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>' }
    ]

    // --- API Methods ---

    const fetchProfile = async () => {
      loading.value = true
      try {
        const response = await api.get('/user/profile')
        Object.assign(profile, response.data)
      } catch (error) {
        console.error('Error fetching profile:', error)
      } finally {
        loading.value = false
      }
    }

    const updateProfile = async () => {
      await api.post('/user/profile', {
          name: profile.name,
          phone: profile.phone,
          reg_number: profile.reg_number
      })
    }

    const updatePassword = async () => {
      if (security.password !== security.password_confirmation) {
        throw new Error("Passwords do not match")
      }
      await api.post('/user/password', security)
      
      // Clear password fields on success
      security.current_password = ''
      security.password = ''
      security.password_confirmation = ''
    }

    // --- Interaction Logic ---

    const askConfirm = (type) => {
      if (type === 'profile') {
        confirm.value = {
          show: true,
          title: 'Update Profile?',
          message: 'Are you sure you want to save these changes to your profile?',
          type: 'primary',
          btnText: 'Save Changes',
          action: updateProfile
        }
      } else if (type === 'password') {
        if (security.password !== security.password_confirmation) {
          alert("New passwords do not match") 
          return
        }
        confirm.value = {
          show: true,
          title: 'Change Password?',
          message: 'This will update your login credentials. You may need to log in again.',
          type: 'danger',
          btnText: 'Update Password',
          action: updatePassword
        }
      }
    }

    const executeConfirm = async () => {
      if (!confirm.value.action) return
      
      isProcessing.value = true
      try {
        await confirm.value.action()
        
        // 1. Close Confirmation Modal
        confirm.value.show = false
        
        // 2. Open Success Modal
        success.value = {
          show: true,
          title: confirm.value.type === 'danger' ? 'Secure Update' : 'Profile Updated',
          message: confirm.value.type === 'danger' 
            ? 'Your password has been successfully changed.' 
            : 'Your profile details have been saved successfully.'
        }

      } catch (error) {
        const msg = error.response?.data?.message || error.message || 'Action failed'
        alert(msg) 
      } finally {
        isProcessing.value = false
      }
    }

    onMounted(() => {
      fetchProfile()
    })

    return {
      currentTab, tabs, profile, security, loading, isProcessing,
      confirm, success,
      askConfirm, executeConfirm
    }
  }
}
</script>

<style scoped>
.settings-page { max-width: 800px; margin: 0 auto; padding: var(--spacing-md); }
.page-header { margin-bottom: var(--spacing-lg); display: flex; justify-content: space-between; align-items: start; }
.page-title { font-size: 2rem; font-weight: 700; color: var(--dark-color); margin-bottom: 0.5rem; }
.title-decoration { width: 60px; height: 4px; background: var(--gradient-primary); border-radius: 2px; }
.page-subtitle { color: var(--gray-color); }
.mb-1 { margin-bottom: 4px; }

/* Role Badge */
.role-badge { text-transform: uppercase; font-size: 0.75rem; font-weight: 700; padding: 4px 8px; border-radius: 4px; background: var(--gray-light); color: var(--gray-dark); }
.role-badge.admin { background: #e0f2fe; color: #0369a1; }
.role-badge.student { background: #dcfce7; color: #15803d; }
.role-badge.lecturer { background: #fef9c3; color: #854d0e; }
.role-badge.hod { background: #f3e8ff; color: #6b21a8; }

/* Tabs */
.settings-tabs { display: flex; gap: var(--spacing-sm); margin-bottom: var(--spacing-lg); border-bottom: 1px solid var(--gray-light); overflow-x: auto; }
.tab-item { display: flex; align-items: center; gap: 8px; padding: 12px 20px; background: none; border: none; border-bottom: 2px solid transparent; font-size: 0.95rem; color: var(--gray-color); cursor: pointer; white-space: nowrap; transition: all 0.2s; }
.tab-item:hover { color: var(--primary-color); }
.tab-item.active { color: var(--primary-color); border-bottom-color: var(--primary-color); font-weight: 600; }

/* Forms */
.card { background: white; padding: var(--spacing-lg); border-radius: var(--border-radius-lg); box-shadow: var(--shadow-sm); border: 1px solid var(--gray-light); }
.card-subtitle { font-size: 1.1rem; font-weight: 600; margin-bottom: var(--spacing-md); color: var(--dark-color); border-bottom: 1px solid var(--light-color); padding-bottom: 10px; }
.form-grid.single-col { display: flex; flex-direction: column; gap: var(--spacing-md); max-width: 100%; }
.form-group { display: flex; flex-direction: column; gap: 6px; }
.form-group label { font-size: 0.9rem; font-weight: 500; color: var(--dark-color); display: flex; justify-content: space-between; }
.badge { font-size: 0.75rem; background: var(--light-color); padding: 2px 6px; border-radius: 4px; color: var(--gray-color); }
.form-input { padding: 12px; border: 1px solid var(--gray-light); border-radius: var(--border-radius-md); font-size: 0.95rem; width: 100%; }
.form-input:disabled { background: #f9fafb; cursor: not-allowed; }
.form-input:focus { outline: none; border-color: var(--primary-color); box-shadow: 0 0 0 3px var(--primary-soft); }
.form-actions { margin-top: var(--spacing-md); display: flex; justify-content: flex-end; }

/* Modal Styles */
.confirm-content { text-align: center; padding: 20px 0; }
.spinner-wrapper { display: flex; flex-direction: column; align-items: center; gap: 12px; color: #6b7280; }
.icon-wrapper { width: 64px; height: 64px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; }
.icon-wrapper.danger { background: #fee2e2; color: #ef4444; }
.icon-wrapper.primary { background: #e0f2fe; color: #0284c7; }

@media (max-width: 600px) {
  .settings-tabs { justify-content: space-between; }
  .tab-item { flex: 1; justify-content: center; padding: 12px 8px; }
  .tab-icon { display: none; }
}
</style>