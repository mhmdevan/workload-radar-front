<template>
  <div class="mt-4">
    <div v-if="!tasks.length && !loading" class="rounded-xl border border-slate-800/80 bg-slate-950/80 p-4 text-xs text-slate-400">
      <p>No tasks created yet for this project.</p>
      <p class="mt-1 text-[0.7rem] text-slate-500">Use the form above to create the first task.</p>
    </div>

    <ul
      v-else
      class="divide-y divide-slate-800/80 overflow-hidden rounded-xl border border-slate-800/80 bg-slate-950/90 shadow-soft"
    >
      <li
        v-for="task in tasks"
        :key="task.id"
        v-motion="taskMotion"
        class="flex items-start justify-between px-4 py-3"
      >
        <div class="flex flex-col gap-1">
          <div class="flex items-center gap-2">
            <span class="text-sm font-medium text-slate-50">
              {{ task.title }}
            </span>
            <span
              class="rounded-full px-2 py-[2px] text-[0.65rem] font-medium"
              :class="badgeClass(task.status)"
            >
              {{ task.status }}
            </span>
          </div>
          <p class="text-xs text-slate-400">
            {{ task.description }}
          </p>
          <div class="flex flex-wrap gap-3 text-[0.7rem] text-slate-500">
            <span>ID: {{ task.id }}</span>
            <span>Assignee: {{ task.assignee }}</span>
            <span>Priority: {{ task.priority }}</span>
          </div>
        </div>

        <div class="ml-3 flex items-center">
          <button
            v-if="task.status !== 'done'"
            class="inline-flex items-center gap-1 rounded-full bg-brand-600 px-3 py-1 text-xs font-medium text-slate-950 shadow-sm hover:bg-brand-500"
            @click="onMarkDone(task.id)"
          >
            Mark done
          </button>
        </div>
      </li>
    </ul>

    <div v-if="loading" class="mt-3">
      <LoadingSpinner label="Loading tasks..." />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

const props = defineProps({
  tasks: {
    type: Array,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emits = defineEmits(['mark-done'])

function onMarkDone(taskId) {
  emits('mark-done', taskId)
}

// Motion configuration for task cards.
const taskMotion = computed(() => ({
  initial: { opacity: 0, y: 6 },
  enter: { opacity: 1, y: 0, transition: { duration: 0.25 } }
}))

function badgeClass(status) {
  if (status === 'done') {
    return 'bg-emerald-500/20 text-emerald-200 border border-emerald-400/60'
  }
  if (status === 'in_progress') {
    return 'bg-sky-500/15 text-sky-200 border border-sky-400/60'
  }
  return 'bg-slate-500/15 text-slate-200 border border-slate-400/60'
}
</script>
