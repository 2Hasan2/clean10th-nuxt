<script setup lang="ts">
definePageMeta({
  breadcrumb: {
    label: 'Create Customer',
    icon: 'heroicons-outline:user-plus',
  },
});

import { object, string, type InferType } from 'yup';
import type { FormSubmitEvent } from '#ui/types';
import debounce from 'lodash/debounce';
import { ref, watch } from 'vue';

// Define validation schema
const schema = object({
  name: string().required('Name is required').min(3, 'Too short').max(255, 'Too long'),
  email: string().nullable().optional().email('Invalid email address').max(255, 'Too long'),
  phone: string().nullable().optional().max(15, 'Too long'),
  address: string().nullable().optional().max(255, 'Too long'),
});

type Schema = InferType<typeof schema>;

const state = reactive({
  name: undefined,
  email: undefined,
  phone: undefined,
  address: undefined,
});

const toast = useToast();

async function onSubmit(event: FormSubmitEvent<Schema>) {
  console.log(event.data);
  try {
    const response = await $fetch('/api/customers', {
      method: 'POST',
      body: event.data,
    });
    toast.add({
      title: 'Customer has been created successfully',
      timeout: 1000,
    });
    state.name = undefined;
    state.email = undefined;
    state.phone = undefined;
    state.address = undefined;
  } catch (error) {
    const errorResponse = error as { data: { error: string } };
    toast.add({
      title: 'Error creating customer',
      description: errorResponse.data.error || 'An error occurred',
    });
  }
}
</script>

<template>
  <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
    <UFormGroup label="Name" name="name">
      <UInput v-model="state.name" placeholder="Enter customer's name" />
    </UFormGroup>

    <UFormGroup label="Email" name="email">
      <UInput v-model="state.email" type="email" placeholder="Enter customer's email" />
    </UFormGroup>

    <UFormGroup label="Phone" name="phone">
      <UInput v-model="state.phone" placeholder="Enter customer's phone number" />
    </UFormGroup>

    <UFormGroup label="Address" name="address">
      <UTextarea v-model="state.address" placeholder="Enter customer's address" />
    </UFormGroup>

    <UButton type="submit">
      Submit
    </UButton>
  </UForm>
</template>
