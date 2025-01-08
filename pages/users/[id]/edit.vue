<script setup lang="ts">
import { object, string, type InferType } from 'yup';
import type { FormSubmitEvent } from '#ui/types';
import { useRoute, useRouter } from 'vue-router';
import type { Role } from "@prisma/client";

definePageMeta({
  breadcrumb: {
    label: 'Edit',
    icon: 'catppuccin:folder-admin'
  },
  requiresAuth: true,
});

const loading = ref(true);
const showPassword = ref(false);
const toast = useToast();
const route = useRoute();
const router = useRouter();

const schema = object({
  email: string().email('Invalid email').required('Required'),
  password: string()
    .notRequired()
    .nullable()
    .test('password-length', 'Must be at least 8 characters', (value) =>
      !value || value.length >= 8
    ),
  name: string().required('Required').min(3, 'Must be at least 3 characters'),
  role: string().required('Required').oneOf<Role>(['ADMIN', 'USER', 'ACCOUNTANT', 'CASHIER'], 'Invalid role'),
});


type Schema = InferType<typeof schema>;

const state = reactive<Schema>({
  email: '',
  password: null,
  name: '',
  role: 'USER',
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
    state.email = response.email;
    state.name = response.name;
    state.role = response.role;
  } catch (error) {
    toast.add({
      title: 'Error fetching user',
      description: (error as any)?.data?.error || 'An error occurred',
      color: 'red',
    });
    router.push('/users');
  } finally {
    loading.value = false;
  }
}

onMounted(fetchUser);

async function onSubmit(event: FormSubmitEvent<Schema>) {
  const userId = route.params.id;
  loading.value = true;
  try {
    await $fetch(`/api/users/${userId}`, {
      method: 'PUT',
      body: event.data,
    });
    toast.add({
      title: 'User updated',
      timeout: 1000,
    });
  } catch (error) {
    toast.add({
      title: 'Error updating user',
      description: (error as any)?.data?.error || 'An error occurred',
      color: 'red',
    });
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div>
    <UCard>
      <h2 class="text-xl font-semibold">Update User</h2>
        <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
          <UFormGroup label="Email" name="email">
            <UInput :loading="loading" v-model="state.email"  :disabled="loading" />
          </UFormGroup>
          <UFormGroup label="Password" autocomplete="off" name="password">
            <UInput :loading="loading" autocomplete="off"
              v-model="state.password"
              :type="showPassword ? 'text' : 'password'"
              :ui="{ icon: { trailing: { pointer: '' } } }"
              :disabled="loading"
              placeholder="Leave blank to keep current password" >
              <template #trailing>
                <UButton
                  color="gray"
                  variant="link"
                  :icon="showPassword ? 'lucide:eye-closed' : 'lucide:eye'"
                  :padded="true"
                  @click="showPassword = !showPassword"
                />
              </template>
            </UInput>
          </UFormGroup>
          <UFormGroup label="Role" name="role">
            <USelect :loading="loading" v-model="state.role"  :disabled="loading" :options="['ADMIN', 'USER', 'ACCOUNTANT', 'CASHIER']" />
          </UFormGroup>
          <UFormGroup label="Name" name="name">
            <UInput :loading="loading" v-model="state.name" :disabled="loading" />
          </UFormGroup>
          <UButton type="submit" :loading="loading" :disabled="loading">Update User</UButton>
        </UForm>
    </UCard>
  </div>
</template>
