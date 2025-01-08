import { useAuthStore } from '~/stores/auth';

export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore();

  if (!authStore.user && authStore.token) {
    authStore.fetchUser().catch(() => {
      navigateTo('/login');
    });
  }

  if (!authStore.isAuthenticated && to.meta.requiresAuth) {
    return navigateTo('/login');
  }
});
