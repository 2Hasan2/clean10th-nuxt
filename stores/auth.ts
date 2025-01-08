import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as { id: string; email: string; name: string } | null,
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
        
        this.user = response.user;
        this.token = response.token;

        const cookie = useCookie('auth_token');
        cookie.value = response.token;

        navigateTo('/');

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

        this.user = response;
      } catch (error) {
        console.error('Failed to fetch user:', error);
        this.logout();
      }
    },
  },
});
