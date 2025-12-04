<template>
  <div class="min-h-screen app-gradient-bg">
    <AppLayout>
      <RouterView />
    </AppLayout>
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'
</script>
