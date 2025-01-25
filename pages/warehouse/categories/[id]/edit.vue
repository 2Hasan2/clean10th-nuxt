<script setup lang="ts">
definePageMeta({
  breadcrumb: {
    label: "edit",
    icon: "catppuccin:folder",
  },
  requiresAuth: true,
  middleware: ["role"],
});

import { object, string, type InferType } from "yup";
import type { FormSubmitEvent } from "#ui/types";

// Define validation schema
const schema = object({
  name: string().required("Required").min(3, "Too short").max(255, "Too long"),
  description: string().max(255, "Too long").optional(),
});

type Schema = InferType<typeof schema>;

const state = reactive({
  name: "",
  description: "",
});

const toast = useToast();
const loading = ref(false);

const categoryId = useRoute().params.id as string;

onMounted(async () => {
  if (categoryId) {
    try {
      const response = await $fetch(`/api/categories/${categoryId}`);
      const category = response as { name: string; description: string };
      state.name = category.name;
      state.description = category.description;
    } catch (error) {
      toast.add({
        title: "Error fetching category details",
        description: "Could not fetch the category details.",
      });
    }
  }
});

async function onSubmit(event: FormSubmitEvent<Schema>) {
  loading.value = true;
  try {
    await $fetch(`/api/categories/${categoryId}`, {
      method: "PUT",
      body: event.data,
    });
    toast.add({
      title: "Category has been updated successfully",
      timeout: 1000,
    });
  } catch (error) {
    const errorResponse = error as { data: { error: string } };
    toast.add({
      title: "Error updating category",
      description: errorResponse.data.error || "An error occurred",
      color: "red",
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

    <UFormGroup label="Description" name="description">
      <UTextarea
        v-model="state.description"
        placeholder="Enter category's description"
        :disabled="loading"
      />
    </UFormGroup>

    <!-- Removed Parent Category Field -->

    <UButton type="submit" :loading="loading" :disabled="loading">
      Submit
    </UButton>
  </UForm>
</template>
