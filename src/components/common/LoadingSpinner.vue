<template>
  <div class="inline-flex items-center gap-2 text-xs text-slate-400" role="status" aria-live="polite">
    <span class="relative inline-flex h-3 w-3">
      <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-500/50"></span>
      <span class="relative inline-flex h-3 w-3 rounded-full bg-brand-500"></span>
    </span>
    <span>{{ label }}</span>
  </div>
</template>

<script setup>
const props = defineProps({
  label: {
    type: String,
    default: 'Loading...'
  }
})
</script>
