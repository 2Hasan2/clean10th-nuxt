<script setup lang="ts">
</script>

<template>
  <div class="flex flex-row gap-4 h-screen">
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
      <UCard :ui="{
        body: {
          background: 'h-full',
        },
      }" class="h-full min-w-fit overflow-y-auto">
        <slot />
      </UCard>
    </div>
  </div>
</template>
