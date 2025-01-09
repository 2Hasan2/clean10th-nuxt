<script setup lang="ts">
definePageMeta({
  breadcrumb: {
    label: 'Users',
    icon: 'catppuccin:folder-admin'
  },
  requiresAuth: true,
  middleware: ['role'],
});


import { useRoute, useRouter } from 'vue-router';
import type { Users } from '@prisma/client';

const route = useRoute();
const router = useRouter();
const toast = useToast();

const loading = ref(true);
const user = ref<Partial<Users>>({
  id: '',
  email: '',
  name: '',
  role: 'CASHIER',
  createdAt: new Date(),
  updatedAt: new Date(),
});

async function fetchUser() {
  const userId = route.params.id;
  loading.value = true;
  try {
    const response = await $fetch(`/api/users/${userId}`);
    if ('error' in response) {
      toast.add({
        title: 'Error fetching user',
        description: response.error,
        color: 'red',
      });
      return;
    }
    user.value = {
      ...response,
      createdAt: new Date(response.createdAt),
      updatedAt: new Date(response.updatedAt),
    };
  } catch (error) {
    toast.add({
      title: 'Error fetching user',
      description: error.message,
      color: 'red',
    });
  } finally {
    loading.value = false;
  }
}

async function deleteUser(userId: string) {
  loading.value = true;
  try {
    const response = await $fetch(`/api/users/${userId}`, {
      method: 'DELETE',
    });
    if ('error' in response) {
      toast.add({
        title: 'Error deleting user',
        description: response.error,
        color: 'red',
      });
      return;
    }
    toast.add({
      title: 'User deleted',
      description: 'User has been deleted successfully',
      color: 'green',
    });
    router.push('/users');
  } catch (error) {
    toast.add({
      title: 'Error deleting user',
      description: error.message,
      color: 'red',
    });
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  fetchUser();
});
</script>

<template>
  <div class="flex flex-col" v-if="user.id">
    <UCard :ui="{ padding: 'p-4', background: 'bg-white dark:bg-gray-800', }">
      <div class="flex flex-col gap-4">
        <div class="flex justify-between items-center">
          <div class="flex flex-col space-y-2">
            <div class="flex gap-4 items-center">
              <h1 class="text-2xl font-bold">
                {{ user.name }}
              </h1>
              <span class="text-sm text-gray-600">
                ID: {{ user.id }}
              </span>
            </div>
          </div>
          <div class="flex items-center">
            <span class="text-sm text-gray-600">
              {{ user.email }}
            </span>
          </div>
          <div class="flex items-center">
            <UButton :to="`/users/${user.id}/edit`">
              Edit
            </UButton>
            <UButton @click="deleteUser(user.id)" color="red" class="ml-2">
              Delete
            </UButton>
          </div>
        </div>
        <div class="flex flex-col gap-2">
          <div class="flex items-center space-x-2">
            <UIcon name="fluent-emoji-flat:eight-oclock" class="w-5 h-5 text-gray-400" />
            <span class="text-gray-400">
              Created At: {{ user.createdAt }}
            </span>
          </div>
          <div class="flex items-center space-x-2">
            <UIcon name="fluent-emoji-flat:ten-oclock" class="w-5 h-5 text-gray-400" />
            <span class="text-gray-400">
              Updated At: {{ user.updatedAt }}
            </span>
          </div>
        </div>
      </div>
    </UCard>
  </div>
  <div v-else>
    <UCard :ui="{ padding: 'p-4', background: 'bg-white dark:bg-gray-700', }">
      <div class="flex flex-col gap-4">
        <div class="flex justify-between items-center">
          <div class="flex flex-col space-y-2">
            <div class="flex gap-4 items-center">
              <USkeleton class="h-8 w-[150px]" />
              <USkeleton class="h-4 w-[80px]" />
            </div>
            <div class="flex items-center space-x-2 mt-2">
              <USkeleton class="h-5 w-5" :ui="{ rounded: 'rounded-full' }" />
              <USkeleton class="h-4 w-[100px]" />
            </div>
          </div>
          <div class="flex items-center">
            <USkeleton class="h-4 w-[250px]" />
          </div>
          <div class="flex items-center">
            <USkeleton class="h-8 w-[80px]" />
          </div>
        </div>
        <div class="flex flex-col gap-2">
          <div class="flex items-center space-x-2">
            <USkeleton class="h-5 w-5" :ui="{ rounded: 'rounded-full' }" />
            <USkeleton class="h-4 w-[180px]" />
          </div>
          <div class="flex items-center space-x-2">
            <USkeleton class="h-5 w-5" :ui="{ rounded: 'rounded-full' }" />
            <USkeleton class="h-4 w-[180px]" />
          </div>
        </div>
      </div>
    </UCard>
  </div>
</template>