import type { Users } from '@prisma/client';
import type { ComputedRef } from 'vue';
declare module '#app' {
  interface NuxtApp {
    $user: ComputedRef<Omit<Users, 'password'> | null>;
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $user: ComputedRef<Omit<Users, 'password'> | null>;
  }
}
