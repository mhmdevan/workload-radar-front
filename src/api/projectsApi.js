import { httpClient } from "./httpClient";

// Project-related API functions.
export const projectsApi = {
  async fetchProjects(ownerId, limit = 20, offset = 0) {
    return httpClient.get("/projects", {
      params: {
        owner_id: ownerId,
        limit,
        offset,
      },
    });
  },

  async createProject(payload) {
    // payload: { owner_id, name }
    return httpClient.post("/projects", payload);
  },
};
