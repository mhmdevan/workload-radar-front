<template>
  <div class="flex flex-col gap-3">
    <div class="flex flex-col gap-1">
      <h2 class="text-lg font-semibold text-slate-50">
        Projects
      </h2>
      <p class="text-xs text-slate-400">
        Enter an owner ID, load projects, and navigate into a project to see its tasks and report.
      </p>
    </div>

    <ErrorBanner v-if="error" :message="error" />

    <section class="rounded-2xl border border-slate-800/80 bg-slate-950/90 p-4 shadow-soft">
      <div class="grid gap-4 md:grid-cols-[minmax(0,0.9fr),minmax(0,1.1fr)]">
        <div class="flex flex-col gap-3">
          <div class="flex flex-col gap-1">
            <label for="ownerId" class="text-[0.75rem] text-slate-400">
              Owner ID
            </label>
            <input
              id="ownerId"
              v-model="ownerIdLocal"
              type="number"
              min="1"
              class="rounded-lg border border-slate-800/80 bg-slate-950/80 px-3 py-1.5 text-sm text-slate-100 outline-none ring-brand-500/40 focus:border-brand-500 focus:ring-2"
              placeholder="For example: 1"
            />
            <p class="text-[0.7rem] text-slate-500">
              This should match the user ID created via backend API (e.g. /auth/register).
            </p>
          </div>

          <button
            class="inline-flex w-fit items-center gap-2 rounded-full bg-slate-900/90 px-4 py-1.5 text-xs font-medium text-slate-100 ring-1 ring-slate-700 hover:bg-slate-800/90"
            @click="onLoadProjects"
          >
            Load projects
          </button>
        </div>

        <div class="flex flex-col gap-2">
          <div class="flex flex-col gap-1">
            <label for="projectName" class="text-[0.75rem] text-slate-400">
              Create new project
            </label>
            <div class="flex gap-2">
              <input
                id="projectName"
                v-model="newProjectName"
                type="text"
                class="flex-1 rounded-lg border border-slate-800/80 bg-slate-950/80 px-3 py-1.5 text-sm text-slate-100 outline-none ring-brand-500/40 focus:border-brand-500 focus:ring-2"
                placeholder="Project name"
              />
              <button
                class="inline-flex items-center gap-1 rounded-full bg-brand-600 px-4 py-1.5 text-xs font-medium text-slate-950 shadow-sm hover:bg-brand-500 disabled:cursor-not-allowed disabled:bg-slate-800 disabled:text-slate-500"
                :disabled="!newProjectName"
                @click="onCreateProject"
              >
                Create
              </button>
            </div>
            <p class="text-[0.7rem] text-slate-500">
              The project will be linked to the owner ID specified on the left.
            </p>
          </div>
        </div>
      </div>
    </section>

    <ProjectList :projects="projects" :loading="loading" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useTitle } from '@vueuse/core'
import { useProjectsStore } from '@/stores/projectsStore'
import ProjectList from '@/components/projects/ProjectList.vue'
import ErrorBanner from '@/components/common/ErrorBanner.vue'

const projectsStore = useProjectsStore()
const { projects, loading, error, ownerId } = storeToRefs(projectsStore)

const newProjectName = ref('')
const ownerIdLocal = ref(ownerId.value)

// Set browser tab title using VueUse.
useTitle('Projects • Workload Radar')

function syncOwnerId() {
  projectsStore.setOwnerId(ownerIdLocal.value)
}

function onLoadProjects() {
  syncOwnerId()
  projectsStore.fetchProjects()
}

async function onCreateProject() {
  syncOwnerId()
  if (!newProjectName.value) return
  await projectsStore.createProject(newProjectName.value)
  newProjectName.value = ''
}
</script>
