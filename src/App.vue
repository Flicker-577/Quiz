<template>
  <div id="app">
    <AppLoader v-if="isLoading" @loaded="handleLoaded" />
    <div v-else id="app-content">
      <main>
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
    </div>
  </div>
</template>

<script>
import AppLoader from '@/components/reusable/GlobalLoader.vue'

export default {
  name: 'App',
  components: {
    AppLoader
  },
  data() {
    return {
      isLoading: true
    }
  },
  methods: {
    handleLoaded() {
      this.isLoading = false
    }
  },
  mounted() {
    // Fallback: if loader doesn't emit loaded event, hide after 3 seconds
    setTimeout(() => {
      this.isLoading = false
    }, 3000)
  }
}
</script>