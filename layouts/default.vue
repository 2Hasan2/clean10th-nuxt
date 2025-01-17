<script setup lang="ts">
import { ref, onMounted } from "vue";
import { SpeedInsights } from "@vercel/speed-insights/nuxt";

const { fetchUser, logout, user, token } = useAuthStore();

const links_vertical = ref([
  [
    {
      label: "POS",
      icon: "catppuccin:salesforce",
      to: "/pos",
      role: ["CASHIER"],
    },
  ],
  [
    {
      label: "Warehouse",
      icon: "catppuccin:folder-packages",
      to: "/warehouse",
      role: ["CASHIER", "ACCOUNTANT"],
    },
    {
      label: "Customers",
      icon: "catppuccin:folder-public",
      to: "/customers",
      role: ["CASHIER"],
    },
    {
      label: "Users",
      icon: "catppuccin:folder-admin",
      to: "/users",
      role: [],
    },
    {
      label: "Orders",
      icon: "catppuccin:folder-scripts",
      to: "/orders",
      role: ["ACCOUNTANT", "CASHIER"],
    },
  ],
]);

const items = [
  [
    {
      label: "Logout",
      slot: "logout",
      icon: "lucide:log-out",
      click: async () => {
        await logout();
      },
    },
  ],
];

if (token && !user) {
  await fetchUser();
}

if (user && user.role === "ADMIN") {
  items.unshift([
    {
      label: "Edit",
      slot: "edit",
      icon: "i-heroicons-pencil-square-20-solid",
      click: async () => {
        navigateTo(`/users/${user.id}/edit`);
      },
    },
  ]);
}

links_vertical.value = links_vertical.value.map((links) => {
  return links.filter((link) => {
    if (user?.role === "ADMIN") {
      return true;
    }
    return user?.role ? link.role.includes(user.role) : false;
  });
});
</script>

<template>
  <div class="flex flex-row gap-4 h-screen">
    <UCard
      class="w-fit"
      :ui="{
        base: 'flex flex-col justify-between gap-4 h-full',
      }"
    >
      <UVerticalNavigation :links="links_vertical" />
      <template #footer>
        <UButton
          v-if="user"
          class="w-full"
          color="yellow"
          icon="lucide:log-out"
          @click="logout"
        >
          Logout
        </UButton>
      </template>
    </UCard>
    <div class="flex flex-col gap-4 w-full min-h-screen">
      <UCard>
        <div class="flex flex-row justify-between items-center">
          <Breadcrumb />
          <UDropdown
            :items="items"
            :ui="{ item: { disabled: 'cursor-text select-text' } }"
            :popper="{ placement: 'bottom-start' }"
          >
            <UBadge color="primary" class="flex-shrink-0" v-if="user">
              {{ user.name }}
            </UBadge>

            <template #edit="{ item }" v-if="user">
              <span class="truncate">{{ item.label }}</span>
              <UIcon
                :name="item.icon"
                class="flex-shrink-0 h-4 w-4 text-gray-400 dark:text-gray-500 ms-auto"
              />
            </template>

            <template #logout="{ item }" v-if="user">
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
