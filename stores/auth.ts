import { defineStore } from 'pinia';
import type { Users } from '@prisma/client'; 

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as Omit<Users, 'password'> | null,
    token: useCookie('auth_token').value || null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
  },

  actions: {
    async login(credentials: { email: string; password: string }) {
      try {
        const response = await $fetch('/api/auth/login', {
          method: 'POST',
          body: credentials,
        });

        if("error" in response) {
          throw new Error(response.error);
        }
        
        this.user = {
          ...response.user,
          createdAt: new Date(response.user.createdAt),
          updatedAt: new Date(response.user.updatedAt),
        };
        this.token = response.token;

        const cookie = useCookie('auth_token');
        cookie.value = response.token;

        return response;
      } catch (error) {
        throw new Error((error as any)?.data?.error || 'Login failed');
      }
    },

    async logout() {
      this.user = null;
      this.token = null;

      const cookie = useCookie('auth_token');
      cookie.value = null;

      navigateTo('/login');
    },

    async fetchUser() {
      if (!this.token) return;

      try {
        const response = await $fetch('/api/auth/me', {
          headers: { Authorization: `Bearer ${this.token}` },
        });

        if("error" in response) {
          throw new Error(response.error);
        }

        this.user = {
          ...response,
          createdAt: new Date(response.createdAt),
          updatedAt: new Date(response.updatedAt),
        };
      } catch (error) {
        console.error('Failed to fetch user:', error);
        this.logout();
      }
    },
  },
});
