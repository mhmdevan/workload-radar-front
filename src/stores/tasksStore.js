import { defineStore } from "pinia";
import { tasksApi } from "@/api/tasksApi";
import { reportsApi } from "@/api/reportsApi";
import { getErrorMessage } from "@/api/httpClient";

// Store for managing tasks and reports for a selected project.
export const useTasksStore = defineStore("tasks", {
  state: () => ({
    tasks: [],
    tasksLoading: false,
    tasksError: null,

    report: null,
    reportLoading: false,
    reportError: null,
  }),

  actions: {
    async fetchTasks(projectId) {
      this.tasksLoading = true;
      this.tasksError = null;

      try {
        const { data } = await tasksApi.fetchTasks(projectId, 100, 0);
        this.tasks = Array.isArray(data) ? data : data.items || [];
      } catch (error) {
        this.tasksError = getErrorMessage(error);
        this.tasks = [];
      } finally {
        this.tasksLoading = false;
      }
    },

    async createTask(projectId, { title, description, assigneeId }) {
      try {
        const payload = {
          title,
          description,
          assignee_id: assigneeId,
        };
        const { data } = await tasksApi.createTask(projectId, payload);
        this.tasks.unshift(data);
      } catch (error) {
        this.tasksError = getErrorMessage(error);
      }
    },

    async updateTaskStatus(taskId, status) {
      try {
        const { data } = await tasksApi.updateTaskStatus(taskId, status);
        const index = this.tasks.findIndex((t) => t.id === taskId);
        if (index !== -1) {
          this.tasks[index] = data;
        }
      } catch (error) {
        this.tasksError = getErrorMessage(error);
      }
    },

    async generateReportForProject(projectId) {
      this.reportLoading = true;
      this.reportError = null;

      try {
        const { data } = await reportsApi.createDailySummary(projectId);
        this.report = data;

        if (data.status === "pending") {
          await this._pollReportUntilReady(data.id);
        }
      } catch (error) {
        this.reportError = getErrorMessage(error);
      } finally {
        this.reportLoading = false;
      }
    },

    async _pollReportUntilReady(reportId) {
      const maxAttempts = 10;
      const delayMs = 1000;

      for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
        const { data } = await reportsApi.getReport(reportId);
        this.report = data;

        if (data.status === "ready") {
          return;
        }

        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }

      this.reportError = "Report is still pending after multiple attempts.";
    },

    clearReport() {
      this.report = null;
      this.reportError = null;
    },
  },
});
