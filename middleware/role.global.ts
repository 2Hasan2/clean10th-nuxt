import { useAuthStore } from '~/stores/auth';
import type { Role } from '@prisma/client'; 

export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore();
  const user = authStore.user;

  if (!user) {
    return navigateTo('/login');
  }

  const requiredRoles = to.meta.role as Role[];
  if (requiredRoles && !requiredRoles.includes(user.role)) {
    return navigateTo('/');
  }
});
