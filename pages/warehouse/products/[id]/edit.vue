<script setup lang="ts">
definePageMeta({
  breadcrumb: {
    label: "edit",
    icon: "catppuccin:folder",
  },
  requiresAuth: true,
  middleware: ["role"],
});

import { number, object, string, type InferType } from "yup";
import type { FormSubmitEvent } from "#ui/types";

// Define validation schema
const schema = object({
  name: string().required("Required").min(3, "Too short").max(255, "Too long"),
  description: string().max(255, "Too long").optional(),
  price: number().positive().min(0, "Too low").default(0),
});

type Schema = InferType<typeof schema>;

const state = reactive({
  name: "",
  description: "",
  price: 0,
});

const toast = useToast();
const loading = ref(true);

const productId = useRoute().params.id as string;

onMounted(async () => {
    if (productId) {
      loading.value = true;
    try {
      const response = await $fetch(`/api/products/${productId}`);
      const product = response as { name: string; description: string };
      state.name = product.name;
      state.description = product.description;
      state.price = product.price;
    } catch (error) {
      toast.add({
        title: "Error fetching product details",
        description: "Could not fetch the product details.",
        color: "yellow",
      });
    } finally {
      loading.value = false;
    }
  }

});

async function onSubmit(event: FormSubmitEvent<Schema>) {
  loading.value = true;
  try {
    await $fetch(`/api/products/${productId}`, {
      method: "PUT",
      body: event.data,
    });
    toast.add({
      title: "product has been updated successfully",
      timeout: 1000,
    });
  } catch (error) {
    const errorResponse = error as { data: { error: string } };
    toast.add({
      title: "Error updating product",
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
        placeholder="Enter product's name"
        :disabled="loading"
      />
    </UFormGroup>

    <UFormGroup label="Description" name="description">
      <UTextarea
        v-model="state.description"
        placeholder="Enter product's description"
        :disabled="loading"
      />
    </UFormGroup>

    <UFormGroup label="Price" name="price">
      <UInput
        v-model="state.price"
        type="number"
        placeholder="Enter product's price"
        :disabled="loading"
      />
    </UFormGroup>

    <UButton type="submit" :loading="loading" :disabled="loading">
      Submit
    </UButton>
  </UForm>
</template>
