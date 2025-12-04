<template>
  <div class="flex min-h-screen flex-col">
    <header
      v-motion="headerMotion"
      class="sticky top-0 z-20 border-b border-slate-800/70 bg-slate-950/80 backdrop-blur"
    >
      <div class="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <div class="flex items-center gap-2">
          <div
            class="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-600 to-orange-400 shadow-soft"
          >
            <SparklesIcon class="h-5 w-5 text-slate-950" />
          </div>
          <div class="flex flex-col leading-tight">
            <span class="text-sm font-semibold text-slate-50">Workload Radar</span>
            <span class="text-[0.7rem] text-slate-400">Projects • Tasks • Reports</span>
          </div>
        </div>

        <nav class="flex items-center gap-4 text-sm">
          <RouterLink
            to="/projects"
            class="rounded-full px-3 py-1 text-slate-300 transition hover:bg-slate-800/80 hover:text-slate-50"
            active-class="bg-slate-800/90 text-slate-50"
          >
            Projects
          </RouterLink>
          <a
            href="https://github.com/mhmdevan/workload-radar/"
            target="_blank"
            rel="noreferrer"
            class="hidden items-center gap-1 rounded-full bg-slate-900/80 px-3 py-1 text-xs text-slate-300 ring-1 ring-slate-800/80 hover:bg-slate-800/80 hover:text-slate-50 sm:inline-flex"
          >
            <CodeBracketIcon class="h-4 w-4" />
            <span>View backend</span>
          </a>
        </nav>
      </div>
    </header>

    <main class="flex-1">
      <div
        v-motion="contentMotion"
        class="mx-auto flex max-w-5xl flex-col gap-4 px-4 pb-8 pt-5"
      >
        <slot />
      </div>
    </main>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import { computed } from 'vue'
import { SparklesIcon, CodeBracketIcon } from '@heroicons/vue/24/outline'

// Simple motion presets for header and content.
const headerMotion = computed(() => ({
  initial: { opacity: 0, y: -20 },
  enter: { opacity: 1, y: 0, transition: { duration: 0.4, easing: 'easeOut' } }
}))

const contentMotion = computed(() => ({
  initial: { opacity: 0, y: 10 },
  enter: { opacity: 1, y: 0, transition: { duration: 0.45, delay: 0.1 } }
}))
</script>
