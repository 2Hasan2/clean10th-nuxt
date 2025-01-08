<script setup lang="ts">
import {useAuthStore} from '~/stores/auth';
const auth = useAuthStore();
onMounted(async () => {
  if (auth.token && !auth.user) {
    await auth.fetchUser();
  }
});
</script>

<template>
  <UContainer class="flex flex-row gap-4 h-screen">
    <div class="flex flex-col gap-4 w-full min-h-screen">
      <UCard>
        <div class="flex flex-row justify-between items-center">
            <Breadcrumb />
            <UBadge color="gray" class="flex-shrink-0">
                Guest
            </UBadge>
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
