import { defineStore } from "pinia";
import { projectsApi } from "@/api/projectsApi";
import { getErrorMessage } from "@/api/httpClient";

// Store for managing project list and active owner.
export const useProjectsStore = defineStore("projects", {
  state: () => ({
    ownerId: "1",
    projects: [],
    loading: false,
    error: null,
  }),
  actions: {
    setOwnerId(value) {
      this.ownerId = value;
    },

    async fetchProjects() {
      if (!this.ownerId) {
        this.error = "Owner ID is required.";
        return;
      }

      this.loading = true;
      this.error = null;

      try {
        const ownerIdNumber = Number(this.ownerId);
        const { data } = await projectsApi.fetchProjects(ownerIdNumber, 50, 0);
        this.projects = Array.isArray(data) ? data : data.items || [];
      } catch (error) {
        this.error = getErrorMessage(error);
        this.projects = [];
      } finally {
        this.loading = false;
      }
    },

    async createProject(name) {
      if (!this.ownerId) {
        this.error = "Owner ID is required to create a project.";
        return;
      }

      try {
        const ownerIdNumber = Number(this.ownerId);
        const payload = {
          owner_id: ownerIdNumber,
          name,
        };
        const { data } = await projectsApi.createProject(payload);
        this.projects.unshift(data);
      } catch (error) {
        this.error = getErrorMessage(error);
      }
    },
  },
});
