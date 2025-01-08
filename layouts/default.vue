<script setup lang="ts">
import {useAuthStore} from '~/stores/auth';
const auth = useAuthStore();

const links_vertical = [
  [{
    label: 'Profile',
    avatar: {
      src: 'https://avatars.githubusercontent.com/u/739984?v=4'
    },
    badge: 100
  }],[
    {
      label: 'POS',
      icon: 'catppuccin:salesforce',
      to: '/pos'
    }
  ],
  [ {
    label: 'Warehouse',
    icon: 'catppuccin:folder-packages',
    to: '/warehouse'
  }, {
    label: 'Customers',
    icon: 'catppuccin:folder-public',
    to: '/customers'
  }, {
    label: 'Users',
    icon: 'catppuccin:folder-admin',
    to: '/users'
  }, {
    label: 'Orders',
    icon: 'catppuccin:folder-scripts',
    to: '/orders'
  }],
  // [{
  //   label: 'Logout',
  //   icon: 'catppuccin:folder-logout',
  //   to: '/logout'
  // }],
  [{
    label: 'whatsapp',
    icon: 'fa:whatsapp',
    to: 'https://wa.me/+201099275294'
  }]
]

const items = [
  [{
    label: 'Edit',
    slot: 'edit',
    icon: 'i-heroicons-pencil-square-20-solid',
    click: () => {
      console.log('Edit')
    }
  }], [{
    label: 'Logout',
    slot: 'logout',
    icon: 'lucide:log-out',
    click: async () => {
      auth.logout();
    }
  }]
]

onMounted(() => {
  if (auth.token && !auth.user) {
    auth.fetchUser();
  }
});
</script>

<template>
  <UContainer class="flex flex-row gap-4 h-screen">
    <UCard class="w-fit">
      <UVerticalNavigation :links="links_vertical" />
    </UCard>
    <div class="flex flex-col gap-4 w-full min-h-screen">
      <UCard>
        <div class="flex flex-row justify-between items-center">
          <Breadcrumb />
          <UDropdown :items="items" :ui="{ item: { disabled: 'cursor-text select-text' } }" :popper="{ placement: 'bottom-start' }">

            <UBadge color="primary" class="flex-shrink-0" v-if="auth.user">
              {{ auth.user.name }}
            </UBadge>

            <template #edit="{ item }" v-if="auth.user">
              <span class="truncate">{{ item.label }}</span>

              <UIcon :name="item.icon" class="flex-shrink-0 h-4 w-4 text-gray-400 dark:text-gray-500 ms-auto" />
            </template>

            <template #logout="{ item }" v-if="auth.user">
              <span class="truncate">{{ item.label }}</span>

              <UIcon :name="item.icon" class="flex-shrink-0 h-4 w-4 text-gray-400 dark:text-gray-500 ms-auto" />
            </template>
          </UDropdown>
        </div>
      </UCard>
      <UCard :ui="{
        body: {
          background: 'h-full',
        },
      }" class="h-full min-w-fit overflow-y-auto">
        <slot />
      </UCard>
    </div>
  </UContainer>
</template>
