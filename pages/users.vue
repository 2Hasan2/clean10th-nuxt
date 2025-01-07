<script setup lang="ts">
import { object, string, type InferType } from 'yup'
import type { FormSubmitEvent } from '#ui/types'
import type { Users } from "@prisma/client"
import { reactive, onMounted } from 'vue'

const users = reactive<Users[]>([])

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

async function listUsers() {
    try {
        const response = await $fetch('/api/users')
        users.splice(0, users.length, ...response.users.map((user: any) => ({
            ...user,
            createdAt: new Date(user.createdAt),
            updatedAt: new Date(user.updatedAt)
        })))
    } catch (error) {
        console.error('Error fetching users:', error)
    }
}

async function onSubmit(event: FormSubmitEvent<Schema>) {
    try {
        const response = await $fetch('/api/users', {
            method: 'POST',
            body: event.data
        })
    } catch (error) {
        console.error('Submission error:', error)
    }
}

onMounted(() => {
    listUsers()
})
</script>

<template>
    <div class="w-60">
        <UCard>
            <UCardHeader>
                <h2 class="text-xl font-semibold">Users</h2>
            </UCardHeader>
            <UCardBody>
                <UList>
                    <UListItem v-for="user in users" :key="user.id">
                        <ULink :href="`/users/${user.id}`">{{ user.name }}</ULink>
                    </UListItem>
                </UList>
            </UCardBody>
        </UCard>
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
                    <UButton type="submit">Create User</UButton>
                </UForm>
            </UCardBody>
        </UCard>
    </div>
</template>
