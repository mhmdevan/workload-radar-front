<template>
  <div
    v-if="message"
    class="mb-3 rounded-xl border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-100 shadow-sm"
    role="alert"
  >
    <span class="font-semibold">Error:</span>
    <span class="ml-1">{{ message }}</span>
  </div>
</template>

<script setup>
const props = defineProps({
  message: {
    type: String,
    default: ''
  }
})
</script>
