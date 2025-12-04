import { httpClient } from "./httpClient";

// Task-related API functions.
export const tasksApi = {
  async fetchTasks(projectId, limit = 50, offset = 0) {
    return httpClient.get(`/tasks/project/${projectId}`, {
      params: {
        limit,
        offset,
      },
    });
  },

  async createTask(projectId, payload) {
    // payload: { title, description, assignee_id }
    return httpClient.post(`/tasks/project/${projectId}`, payload);
  },

  async updateTaskStatus(taskId, status) {
    // status: "todo" | "in_progress" | "done"
    return httpClient.patch(`/tasks/${taskId}/status`, { status });
  },
};
