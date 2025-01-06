<script setup lang="ts">
definePageMeta({
  breadcrumb: {
    label: 'create',
    icon: 'catppuccin:taskfile',
  },
});

import { object, string, number, type InferType } from 'yup'
import type { FormSubmitEvent } from '#ui/types'
import debounce from 'lodash/debounce';
import { ref, watch } from 'vue'

// Define validation schema
const schema = object({
  name: string().required("Required").min(3, "Too short").max(255, "Too long"),
  description: string().max(255, "Too long").optional(),
  price: number().positive().min(0, "Too low").default(0),
  categoryId: string().required("Required"),
})

type Schema = InferType<typeof schema>

const state = reactive({
  name: '',
  description: '',
  categoryId: '',
  price: 0,
})

const toast = useToast()

const nameCategory = ref<string>('')
const categories = ref<any>([])

const selectedCategory = ref<{
    label: string
    value: string
}>({
    label: '',
    value: ''
})

const handleSearch = debounce(async (query: string) => {
    if (query.length >= 2) {
        const { data } = await useAsyncData('categories', async () => {
            const response = await $fetch("/api/categories/", {
                params: {
                    name: query
                }
            })
            return response
        })
        categories.value = data.value?.categories ?? []
    } else {
        categories.value = []
    }
})

watch(nameCategory, async (query) => {
    handleSearch(query)
})

watch(selectedCategory, (value) => {
    state.categoryId = value.value
})

async function onSubmit(event: FormSubmitEvent<Schema>) {
    try {
        const response = await $fetch('/api/products', {
            method: 'POST',
            body: event.data,
        })
        toast.add({
            title: 'Product has been created successfully',
            timeout: 1000,
        })
    } catch (error) {
        const errorResponse = error as { data: { error: string } }
        toast.add({
            title: 'Error creating product',
            description: errorResponse.data.error || 'An error occurred',
        })
    }
    // clear form
    state.name = ''
    state.description = ''
    state.price = 0
    selectedCategory.value = {
        label: '',
        value: ''
    }
}
</script>

<template>
  <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
    
    <UFormGroup label="Name" name="name">
      <UInput v-model="state.name" />
    </UFormGroup>

    <UFormGroup label="Description" name="description">
      <UTextarea v-model="state.description" />
    </UFormGroup>

    <UFormGroup label="Price" name="price">
      <UInput v-model="state.price" type="number" />
    </UFormGroup>

    <UFormGroup label="Category" name="categoryId">
        <UInputMenu 
        v-model="selectedCategory" 
        v-model:query="nameCategory"
        :options="categories?.map((category: any) => ({ label: category.name, value: category.id }))"
        placeholder="Search for category..."
      />
    </UFormGroup>

    <UButton type="submit">
      Submit
    </UButton>
  </UForm>
</template>
