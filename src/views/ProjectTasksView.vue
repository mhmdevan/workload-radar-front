<template>
  <div class="flex flex-col gap-3">
    <header class="flex items-baseline justify-between gap-3">
      <div>
        <h2 class="text-lg font-semibold text-slate-50">
          Project #{{ projectId }} – tasks
        </h2>
        <p class="text-xs text-slate-400">
          Manage tasks for this project and generate analytical reports.
        </p>
      </div>
      <RouterLink
        to="/projects"
        class="text-[0.75rem] text-slate-400 hover:text-slate-100"
      >
        ← Back to projects
      </RouterLink>
    </header>

    <ErrorBanner v-if="tasksError" :message="tasksError" />

    <section class="rounded-2xl border border-slate-800/80 bg-slate-950/90 p-4 shadow-soft">
      <div class="grid gap-4 md:grid-cols-[minmax(0,1.1fr),minmax(0,0.9fr)]">
        <div class="flex flex-col gap-2">
          <div class="flex flex-col gap-1">
            <label for="taskTitle" class="text-[0.75rem] text-slate-400">
              New task title
            </label>
            <input
              id="taskTitle"
              v-model="newTaskTitle"
              type="text"
              class="rounded-lg border border-slate-800/80 bg-slate-950/80 px-3 py-1.5 text-sm text-slate-100 outline-none ring-brand-500/40 focus:border-brand-500 focus:ring-2"
              placeholder="Short summary"
            />
          </div>

          <div class="flex flex-col gap-1">
            <label for="taskDescription" class="text-[0.75rem] text-slate-400">
              Description
            </label>
            <input
              id="taskDescription"
              v-model="newTaskDescription"
              type="text"
              class="rounded-lg border border-slate-800/80 bg-slate-950/80 px-3 py-1.5 text-sm text-slate-100 outline-none ring-brand-500/40 focus:border-brand-500 focus:ring-2"
              placeholder="Optional details"
            />
          </div>
        </div>

        <div class="flex flex-col gap-2">
          <div class="flex flex-col gap-1">
            <label for="assigneeId" class="text-[0.75rem] text-slate-400">
              Assignee ID
            </label>
            <input
              id="assigneeId"
              v-model="assigneeId"
              type="number"
              min="1"
              class="rounded-lg border border-slate-800/80 bg-slate-950/80 px-3 py-1.5 text-sm text-slate-100 outline-none ring-brand-500/40 focus:border-brand-500 focus:ring-2"
              placeholder="User id, for example: 1"
            />
          </div>

          <div class="flex items-end">
            <button
              class="inline-flex items-center gap-1 rounded-full bg-brand-600 px-4 py-1.5 text-xs font-medium text-slate-950 shadow-sm hover:bg-brand-500 disabled:cursor-not-allowed disabled:bg-slate-800 disabled:text-slate-500"
              :disabled="!newTaskTitle || !assigneeId"
              @click="onCreateTask"
            >
              Create task
            </button>
          </div>
        </div>
      </div>
    </section>

    <TaskList
      :tasks="tasks"
      :loading="tasksLoading"
      @mark-done="onMarkTaskDone"
    />

    <ReportPanel
      :report="report"
      :loading="reportLoading"
      :error="reportError"
      @generate="onGenerateReport"
    />
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useTitle } from '@vueuse/core'
import { useTasksStore } from '@/stores/tasksStore'
import TaskList from '@/components/tasks/TaskList.vue'
import ReportPanel from '@/components/reports/ReportPanel.vue'
import ErrorBanner from '@/components/common/ErrorBanner.vue'

const route = useRoute()
const projectId = route.params.projectId

const tasksStore = useTasksStore()
const {
  tasks,
  tasksLoading,
  tasksError,
  report,
  reportLoading,
  reportError
} = storeToRefs(tasksStore)

const newTaskTitle = ref('')
const newTaskDescription = ref('')
const assigneeId = ref('1')

// Set browser tab title using VueUse.
useTitle(`Project #${projectId} • Workload Radar`)

onMounted(() => {
  if (projectId) {
    tasksStore.fetchTasks(projectId)
    tasksStore.clearReport()
  }
})

watch(
  () => route.params.projectId,
  (newId) => {
    if (newId) {
      tasksStore.fetchTasks(newId)
      tasksStore.clearReport()
    }
  }
)

async function onCreateTask() {
  if (!projectId || !newTaskTitle.value || !assigneeId.value) return

  await tasksStore.createTask(projectId, {
    title: newTaskTitle.value,
    description: newTaskDescription.value,
    assigneeId: Number(assigneeId.value)
  })

  newTaskTitle.value = ''
  newTaskDescription.value = ''
}

async function onMarkTaskDone(taskId) {
  await tasksStore.updateTaskStatus(taskId, 'done')
}

async function onGenerateReport() {
  if (!projectId) return
  await tasksStore.generateReportForProject(projectId)
}
</script>
