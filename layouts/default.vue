<script setup lang="ts">
const links_vertical = [
  [{
    label: 'Profile',
    avatar: {
      src: 'https://avatars.githubusercontent.com/u/739984?v=4'
    },
    badge: 100
  }, {
    label: 'Stock',
    icon: 'catppuccin:folder-packages',
    to: '/stock'
  }, {
    label: 'Admin',
    icon: 'catppuccin:folder-admin',
    to: '/admin'
  }, {
    label: 'reports',
    icon: 'catppuccin:folder-scripts',
    to: '/reports'
  }],
  [{
    label: 'whatsapp',
    icon: 'fa:whatsapp',
    to: 'https://wa.me/+201099275294'
  }]
]
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
          <UPopover class="flex" mode="hover">
            <UAvatar chip-color="red" chip-text="" chip-position="top-right" size="md"
              src="https://avatars.githubusercontent.com/u/739984?v=4" alt="Avatar" />
            <template #panel>
              <div class="p-4">
                fuck off
                <UIcon name="catppuccin:folder-packages" class="w-5 h-5" />
              </div>
            </template>
          </UPopover>
        </div>
      </UCard>
      <UCard class="h-full min-w-fit overflow-y-auto">
        <slot />
      </UCard>
    </div>
  </UContainer>
</template>
