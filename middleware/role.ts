// import { useAuthStore } from '~/stores/auth';
import type { Role, Users } from '@prisma/client'; 

export default defineNuxtRouteMiddleware((to, from) => {
  const { $user } = useNuxtApp();
  
  if (!$user) {
    return navigateTo('/login');
  }

  const requiredRoles = to.meta.role as Role[];
  
  if ($user.role === 'ADMIN') {
    return true;
  }

  console.log($user.role, requiredRoles);

  if (!requiredRoles) {
    return navigateTo('/');
  }
  if (!requiredRoles.includes($user.role)) {
    return navigateTo('/');
  }
});
