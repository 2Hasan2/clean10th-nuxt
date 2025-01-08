<script setup lang="ts">
import { object, string, type InferType } from 'yup'
import type { FormSubmitEvent } from '#ui/types'

definePageMeta({
    breadcrumb: {
        label: 'users',
        icon: 'catppuccin:folder'
    },
    requiresAuth: true,
});

const loading = ref(false)
const toast = useToast()

const schema = object({
    email: string().email('Invalid email').required('Required'),
    password: string().min(8, 'Must be at least 8 characters').required('Required'),
    name: string().required('Required').min(3, 'Must be at least 3 characters'),
})

type Schema = InferType<typeof schema>

const state = reactive<Schema>({
    email: '',
    password: '',
    name: ''
})

async function onSubmit(event: FormSubmitEvent<Schema>) {
    loading.value = true
    try {
        await $fetch('/api/users', {
            method: 'POST',
            body: event.data
        })
        toast.add({
            title: 'User created',
            timeout: 1000,
        })
    } catch (error) {
        toast.add({
            title: 'Error creating user',
            description: (error as any)?.data?.error || 'An error occurred',
            color: 'red'
        })
    } finally {
        loading.value = false
    }
}
</script>

<template>
    <div class="w-60">
        <UCard>
            <UCardHeader>
                <h2 class="text-xl font-semibold">Create User</h2>
            </UCardHeader>
            <UCardBody>
                <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
                    <UFormGroup label="Email" name="email">
                        <UInput v-model="state.email" />
                    </UFormGroup>
                    <UFormGroup label="Password" name="password">
                        <UInput v-model="state.password" type="password" />
                    </UFormGroup>
                    <UFormGroup label="Name" name="name">
                        <UInput v-model="state.name" />
                    </UFormGroup>
                    <UButton type="submit" :loading="loading" >Create User</UButton>
                </UForm>
            </UCardBody>
        </UCard>
    </div>
</template>
