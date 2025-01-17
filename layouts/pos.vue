<script setup lang="ts">
import { useAuthStore } from "~/stores/auth";
import { SpeedInsights } from "@vercel/speed-insights/nuxt";

const auth = useAuthStore();

const items = [
  // [{
  //   label: 'Edit',
  //   slot: 'edit',
  //   icon: 'i-heroicons-pencil-square-20-solid',
  //   click: () => {
  //     console.log('Edit')
  //   }
  // }],
  [
    {
      label: "Logout",
      slot: "logout",
      icon: "lucide:log-out",
      click: async () => {
        auth.logout();
      },
    },
  ],
];
</script>

<template>
  <div class="flex flex-row gap-4 h-screen">
    <div class="flex flex-col gap-4 w-full min-h-screen">
      <UCard>
        <div class="flex flex-row justify-between items-center">
          <Breadcrumb />
          <UDropdown
            :items="items"
            :ui="{ item: { disabled: 'cursor-text select-text' } }"
            :popper="{ placement: 'bottom-start' }"
          >
            <UBadge color="primary" class="flex-shrink-0" v-if="auth.user">
              {{ auth.user.name }}
            </UBadge>

            <template #edit="{ item }" v-if="auth.user">
              <span class="truncate">{{ item.label }}</span>

              <UIcon
                :name="item.icon"
                class="flex-shrink-0 h-4 w-4 text-gray-400 dark:text-gray-500 ms-auto"
              />
            </template>

            <template #logout="{ item }" v-if="auth.user">
              <span class="truncate">{{ item.label }}</span>

              <UIcon
                :name="item.icon"
                class="flex-shrink-0 h-4 w-4 text-gray-400 dark:text-gray-500 ms-auto"
              />
            </template>
          </UDropdown>
        </div>
      </UCard>
      <UCard
        :ui="{
          body: {
            background: 'h-full',
          },
        }"
        class="h-full min-w-fit overflow-y-auto"
      >
        <slot />
      </UCard>
    </div>
  </div>
  <SpeedInsights />
</template>
