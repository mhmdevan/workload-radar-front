import { httpClient } from "./httpClient";

// Report-related API functions.
export const reportsApi = {
  async createDailySummary(projectId) {
    return httpClient.post(`/reports/project/${projectId}/daily-summary`, {});
  },

  async getReport(reportId) {
    return httpClient.get(`/reports/${reportId}`);
  },
};
