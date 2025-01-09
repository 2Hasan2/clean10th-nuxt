import type { Users } from '@prisma/client';
declare module '#app' {
  interface NuxtApp {
    $user: Omit<Users, 'password'>;
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $user: Omit<Users, 'password'>;
  }
}
