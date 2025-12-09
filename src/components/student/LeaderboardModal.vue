<template>
  <AppModal :show="show" title="🏆 Class Leaderboard" width="500px" @close="$emit('close')">
    <div class="leaderboard-content" v-if="!loading">
      
      <div class="podium">
        <div class="podium-place silver">
          <div class="avatar">{{ getInitials(top3[1]?.name) }}</div>
          <div class="bar">2</div>
          <span class="name">{{ top3[1]?.name || '-' }}</span>
          <span class="points">{{ top3[1]?.points || 0 }} pts</span>
        </div>
        <div class="podium-place gold">
          <div class="crown">👑</div>
          <div class="avatar">{{ getInitials(top3[0]?.name) }}</div>
          <div class="bar">1</div>
          <span class="name">{{ top3[0]?.name || '-' }}</span>
          <span class="points">{{ top3[0]?.points || 0 }} pts</span>
        </div>
        <div class="podium-place bronze">
          <div class="avatar">{{ getInitials(top3[2]?.name) }}</div>
          <div class="bar">3</div>
          <span class="name">{{ top3[2]?.name || '-' }}</span>
          <span class="points">{{ top3[2]?.points || 0 }} pts</span>
        </div>
      </div>

      <div class="rank-list">
        <div 
          v-for="(student, index) in restList" 
          :key="student.id" 
          class="rank-row"
          :class="{ 'me': student.is_me }"
        >
          <span class="rank-num">#{{ index + 4 }}</span>
          <div class="rank-info">
            <span class="rank-name">{{ student.name }}</span>
            <span class="rank-points">{{ student.points }} pts</span>
          </div>
        </div>
      </div>

    </div>
    <div v-else class="loading-state">
      <AppSkeleton type="card" height="300px" />
    </div>

    <template #footer>
      <AppButton variant="outline" @click="$emit('close')">Close</AppButton>
    </template>
  </AppModal>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import AppModal from '../reusable/AppModal.vue';
import AppButton from '../reusable/AppButton.vue';
import AppSkeleton from '../reusable/AppSkeleton.vue';
import api from '@/api/api'; // Assuming you have an API endpoint

const props = defineProps({ show: Boolean });
defineEmits(['close']);

const loading = ref(false);
const leaderboardData = ref([]);

// Mock data fetch logic
const fetchLeaderboard = async () => {
  loading.value = true;
  try {
    // Replace with: const res = await api.get('/student/leaderboard');
    // leaderboardData.value = res.data;
    
    // Mock Data
    await new Promise(r => setTimeout(r, 800));
    leaderboardData.value = [
      { id: 1, name: 'Sarah Connor', points: 1250 },
      { id: 2, name: 'John Doe', points: 1100 },
      { id: 3, name: 'Alice Smith', points: 950 },
      { id: 4, name: 'You', points: 800, is_me: true },
      { id: 5, name: 'Mike Ross', points: 750 },
    ];
  } catch(e) { console.error(e); }
  finally { loading.value = false; }
};

watch(() => props.show, (val) => {
  if (val) fetchLeaderboard();
});

const top3 = computed(() => leaderboardData.value.slice(0, 3));
const restList = computed(() => leaderboardData.value.slice(3));

const getInitials = (name) => name ? name.split(' ').map(n=>n[0]).join('').substring(0,2) : '?';
</script>

<style scoped>
.podium {
  display: flex; justify-content: center; align-items: flex-end; gap: 10px;
  margin-bottom: 30px; border-bottom: 1px solid #eee; padding-bottom: 20px;
}
.podium-place { text-align: center; display: flex; flex-direction: column; align-items: center; }
.avatar { 
  width: 40px; height: 40px; background: #ddd; border-radius: 50%; 
  display: flex; align-items: center; justify-content: center; font-weight: bold; color: #555;
  margin-bottom: 5px; border: 2px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}
.bar { width: 60px; border-radius: 8px 8px 0 0; color: white; font-weight: bold; display: flex; align-items: flex-end; justify-content: center; padding-bottom: 5px; }
.name { font-size: 0.8rem; font-weight: 600; margin-top: 5px; max-width: 70px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.points { font-size: 0.75rem; color: #666; }

.gold .bar { height: 100px; background: #f59e0b; }
.gold .avatar { border-color: #f59e0b; background: #fef3c7; color: #d97706; width: 50px; height: 50px; }
.silver .bar { height: 70px; background: #94a3b8; }
.bronze .bar { height: 50px; background: #d97706; }
.crown { font-size: 1.5rem; margin-bottom: -10px; z-index: 1; }

.rank-list { display: flex; flex-direction: column; gap: 8px; max-height: 300px; overflow-y: auto; }
.rank-row { 
  display: flex; align-items: center; gap: 15px; padding: 10px; 
  background: #f9fafb; border-radius: 8px; 
}
.rank-row.me { background: #eff6ff; border: 1px solid #bfdbfe; }
.rank-num { font-weight: 700; color: #9ca3af; width: 30px; }
.rank-info { display: flex; justify-content: space-between; flex-grow: 1; }
.rank-name { font-weight: 600; color: #374151; }
.rank-points { font-weight: 700; color: #2563eb; }
</style>