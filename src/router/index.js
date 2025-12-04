import { createRouter, createWebHistory } from "vue-router";
import ProjectsView from "@/views/ProjectsView.vue";
import ProjectTasksView from "@/views/ProjectTasksView.vue";

// Simple router for projects and tasks.
const routes = [
  {
    path: "/",
    redirect: "/projects",
  },
  {
    path: "/projects",
    name: "projects",
    component: ProjectsView,
  },
  {
    path: "/projects/:projectId/tasks",
    name: "projectTasks",
    component: ProjectTasksView,
    props: true,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
