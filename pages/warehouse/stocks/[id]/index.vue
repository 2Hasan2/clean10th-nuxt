<script setup lang="ts">
definePageMeta({
  breadcrumb: {
    label: 'edit',
    icon: 'catppuccin:follder',
  },
});

import { object, number, type InferType } from 'yup'
import type { FormSubmitEvent } from '#ui/types'

const route = useRoute()

const schema = object({
    quantity: number().required("Required").min(0, "Too low").default(0).max(999_999_999, "Too high"),
})

type Schema = InferType<typeof schema>

const loading = ref(true)
const state = reactive({
    quantity: 0,
})

const toast = useToast()

async function fetchStock() {
    loading.value = true
    try {
        const response = await $fetch(`/api/products/stock/${route.params.id}`)
        state.quantity = response.quantity
    } catch (error) {
        toast.add({
            title: 'Error fetching stock',
            description: 'An error occurred',
            color: 'red'
        })
    } finally {
        loading.value = false
    }
}

async function onSubmit(event: FormSubmitEvent<Schema>) {
    try {
        const response = await $fetch(`/api/products/stock/${route.params.id}`, {
            method: "POST",
            body: event.data,
        })
        toast.add({
            title: 'Stock updated',
            timeout: 1000,
        })
        state.quantity = response.quantity
    } catch (error) {
        const errorResponse = error as { data: { error: string } }
        toast.add({
            title: 'Error updating stock',
            description: errorResponse.data.error || 'An error occurred',
            color: 'red'
        })
    }
}

onMounted(() => {
    fetchStock()
})
</script>

<template>
  <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
    <UFormGroup label="Quantity" name="quantity">
        <UInput size="lg" :loading="loading" min="0" v-model="state.quantity" type="number" />
    </UFormGroup>
    <UButtonGroup>
        <UButton type="submit">
          Submit
        </UButton>
        <UButton type="button" color="yellow" @click="fetchStock">
            Reset
        </UButton>
    </UButtonGroup>
  </UForm>
</template>
