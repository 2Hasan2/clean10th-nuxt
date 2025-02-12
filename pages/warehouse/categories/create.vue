<script setup lang="ts">
definePageMeta({
  breadcrumb: {
    label: "create",
    icon: "catppuccin:taskfile",
  },
  requiresAuth: true,
  middleware: ["role"],
});

import { object, string, type InferType } from "yup";
import type { FormSubmitEvent } from "#ui/types";
import debounce from "lodash/debounce";
import { ref, watch } from "vue";

const schema = object({
  name: string().required("Required").min(3, "Too short").max(255, "Too long"),
});

type Schema = InferType<typeof schema>;

const state = reactive({
  name: "",
});

const toast = useToast();
const loading = ref(false);

async function onSubmit(event: FormSubmitEvent<Schema>) {
  loading.value = true;
  try {
    await $fetch("/api/categories", {
      method: "POST",
      body: event.data,
    });
    toast.add({
      title: "Category has been created successfully",
      timeout: 1000,
    });
    state.name = "";
  } catch (error) {
    const errorResponse = error as { data: { error: string } };
    toast.add({
      title: "Error creating category",
      description: errorResponse.data.error || "An error occurred",
    });
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
    <UFormGroup label="Name" name="name">
      <UInput
        v-model="state.name"
        placeholder="Enter category's name"
        :disabled="loading"
      />
    </UFormGroup>

    <UButton type="submit" :loading="loading" :disabled="loading">
      Submit
    </UButton>
  </UForm>
</template>
