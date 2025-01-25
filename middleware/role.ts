import { useAuthStore } from '~/stores/auth';
import type { Role, Users } from '@prisma/client'; 

export default defineNuxtRouteMiddleware((to, from) => {
  const { $user } = useNuxtApp();
  const auth = useAuthStore()
  
  if (!$user.value) {
    auth.fetchUser().catch(() => {
      navigateTo('/login');
    });
    return true
  }

  const requiredRoles = to.meta.role as Role[];
  
  if ($user.value.role === 'ADMIN') {
    return true;
  }

  if (!requiredRoles) {
    return navigateTo('/');
  }
  if (!requiredRoles.includes($user.value.role)) {
    return navigateTo('/');
  }
});
