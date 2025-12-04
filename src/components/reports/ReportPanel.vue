<template>
  <section class="mt-6 rounded-2xl border border-slate-800/80 bg-slate-950/90 p-4 shadow-soft">
    <div class="flex items-center justify-between gap-3">
      <div>
        <h2 class="text-sm font-semibold text-slate-50">
          Project report
        </h2>
        <p class="text-[0.7rem] text-slate-500">
          Generate a daily summary with status counts and average lead time.
        </p>
      </div>

      <div class="flex items-center gap-2">
        <button
          class="inline-flex items-center gap-1 rounded-full bg-slate-900/90 px-3 py-1 text-xs text-slate-100 ring-1 ring-slate-700/80 hover:bg-slate-800/90"
          :disabled="loading"
          @click="onGenerate"
        >
          <span v-if="!loading">Generate report</span>
          <span v-else>Generating...</span>
        </button>
      </div>
    </div>

    <ErrorBanner v-if="error" :message="error" />

    <div v-if="loading" class="mt-3">
      <LoadingSpinner label="Waiting for report..." />
    </div>

    <div v-if="report" class="mt-3 grid gap-4 md:grid-cols-[minmax(0,1.2fr),minmax(0,1fr)]">
      <div class="rounded-xl border border-slate-800/70 bg-slate-950/90 p-3 text-[0.75rem] text-slate-300">
        <h3 class="mb-2 text-xs font-semibold text-slate-200">
          Metadata
        </h3>
        <dl class="grid gap-1">
          <div class="flex gap-2">
            <dt class="w-20 text-slate-500">ID</dt>
            <dd>#{{ report.id }}</dd>
          </div>
          <div class="flex gap-2">
            <dt class="w-20 text-slate-500">Status</dt>
            <dd class="capitalize">
              {{ report.status }}
            </dd>
          </div>
          <div class="flex gap-2">
            <dt class="w-20 text-slate-500">Created</dt>
            <dd>{{ report.created_at }}</dd>
          </div>
          <div v-if="report.finished_at" class="flex gap-2">
            <dt class="w-20 text-slate-500">Finished</dt>
            <dd>{{ report.finished_at }}</dd>
          </div>
        </dl>
      </div>

      <div class="rounded-xl border border-slate-800/70 bg-slate-950/90 p-3 text-[0.75rem] text-slate-300">
        <h3 class="mb-2 text-xs font-semibold text-slate-200">
          Metrics
        </h3>

        <div
          v-if="report.result && Object.keys(report.result).length"
          class="space-y-3"
        >
          <div v-if="report.result.status_counts" class="rounded-lg bg-slate-900/80 p-2">
            <p class="mb-1 text-[0.7rem] uppercase tracking-wide text-slate-400">
              Status counts
            </p>
            <ul class="flex flex-wrap gap-2">
              <li
                v-for="(count, statusKey) in report.result.status_counts"
                :key="statusKey"
                class="inline-flex items-center gap-1 rounded-full bg-slate-950/90 px-2 py-[2px] text-[0.7rem]"
              >
                <span class="capitalize text-slate-300">{{ statusKey }}:</span>
                <span class="font-semibold text-slate-50">{{ count }}</span>
              </li>
            </ul>
          </div>

          <div
            v-if="typeof report.result.avg_lead_time_days_last_30_days === 'number'"
            class="rounded-lg bg-slate-900/80 p-2"
          >
            <p class="mb-1 text-[0.7rem] uppercase tracking-wide text-slate-400">
              Average lead time (last 30 days)
            </p>
            <p class="text-lg font-semibold text-brand-500">
              {{ report.result.avg_lead_time_days_last_30_days.toFixed(2) }}
              <span class="ml-1 text-xs text-slate-400">days</span>
            </p>
          </div>
        </div>

        <div v-else class="text-[0.7rem] text-slate-500">
          No metrics available in this report yet.
        </div>
      </div>
    </div>

    <div v-else-if="!loading" class="mt-3 text-[0.7rem] text-slate-500">
      No report generated yet for this project.
    </div>
  </section>
</template>

<script setup>
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import ErrorBanner from '@/components/common/ErrorBanner.vue'

const props = defineProps({
  report: {
    type: Object,
    default: null
  },
  loading: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: ''
  }
})

const emits = defineEmits(['generate'])

function onGenerate() {
  emits('generate')
}
</script>
