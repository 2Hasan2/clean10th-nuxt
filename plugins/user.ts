import { defineNuxtPlugin } from 'nuxt/app';
import { useAuthStore } from '~/stores/auth';

export default defineNuxtPlugin((nuxtApp) => {
  const authStore = useAuthStore();
  nuxtApp.provide('user', computed(() => authStore.user));
});
