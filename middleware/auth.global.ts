export default defineNuxtRouteMiddleware((to, from) => {
  const {$user} = useNuxtApp();
  const auth = useAuthStore();

  if (!$user) {
    auth.fetchUser().catch(() => {
      navigateTo('/login');
    });
  }

  if (!auth.isAuthenticated && to.meta.requiresAuth) {
    return navigateTo('/login');
  }
});
