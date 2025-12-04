<template>
  <div class="mt-4">
    <div v-if="!projects.length && !loading" class="rounded-xl border border-slate-800/80 bg-slate-950/80 p-4 text-xs text-slate-400">
      <p>No projects found for this owner.</p>
      <p class="mt-1 text-[0.7rem] text-slate-500">Create a project using the form above.</p>
    </div>

    <ul
      v-else
      class="divide-y divide-slate-800/80 overflow-hidden rounded-xl border border-slate-800/80 bg-slate-950/90 shadow-soft"
    >
      <li
        v-for="project in projects"
        :key="project.id"
        v-motion="cardMotion"
        class="flex items-center justify-between px-4 py-3"
      >
        <div class="flex flex-col gap-1">
          <div class="flex items-center gap-2">
            <span class="text-sm font-medium text-slate-50">
              {{ project.name }}
            </span>
            <span class="rounded-full bg-slate-800/80 px-2 py-[2px] text-[0.65rem] text-slate-300">
              #{{ project.id }}
            </span>
          </div>
          <div class="flex flex-wrap items-center gap-3 text-[0.7rem] text-slate-400">
            <span>Owner: {{ project.owner }}</span>
            <span v-if="project.created_at" class="text-slate-500">
              Created at: {{ project.created_at }}
            </span>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <RouterLink
            class="inline-flex items-center gap-1 rounded-full bg-slate-900/90 px-3 py-1 text-xs text-slate-100 ring-1 ring-slate-700/70 hover:bg-slate-800/90 hover:ring-slate-500"
            :to="{ name: 'projectTasks', params: { projectId: project.id } }"
          >
            View tasks
          </RouterLink>
        </div>
      </li>
    </ul>

    <div v-if="loading" class="mt-3">
      <LoadingSpinner label="Loading projects..." />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

const props = defineProps({
  projects: {
    type: Array,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  }
})

// Motion configuration for project cards.
const cardMotion = computed(() => ({
  initial: { opacity: 0, y: 8 },
  enter: { opacity: 1, y: 0, transition: { duration: 0.25 } }
}))
</script>
