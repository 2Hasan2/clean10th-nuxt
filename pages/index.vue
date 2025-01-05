<script setup lang="ts">
import { object, string, type InferType } from 'yup'
import type { FormSubmitEvent } from '#ui/types'
const { createUser, listUsers } = userStore();

const schema = object({
    email: string().email('Invalid email').required('Required'),
    name: string().required('Required').min(3, 'Must be at least 3 characters'),
})

type Schema = InferType<typeof schema>

const state = reactive<Schema>({
    email: '',
    name: ''
})

async function onSubmit(event: FormSubmitEvent<Schema>) {
    try {
        await createUser(event.data)
    } catch (error) {
        console.error('Submission error:', error)
    }
}

</script>

<template>
    <div>
        <UCard>
            <UCardHeader>
                <h2 class="text-xl font-semibold">Users</h2>
            </UCardHeader>
            <UCardBody>
                <UList>
                    <UListItem v-for="user in listUsers()" :key="user.id">
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
                    <UFormGroup label="Name" name="name">
                        <UInput v-model="state.name" />
                    </UFormGroup>
                    <UButton type="submit">Create User</UButton>
                </UForm>
            </UCardBody>
        </UCard>
    </div>
</template>