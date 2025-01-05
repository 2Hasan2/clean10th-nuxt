<script setup lang="ts">
import { reactive } from 'vue'
import { object, string, type InferType } from 'yup'
import type { FormSubmitEvent } from '#ui/types'

// Define the validation schema using yup
const schema = object({
    email: string().email('Invalid email').required('Required'),
    password: string()
        .min(8, 'Must be at least 8 characters')
        .required('Required')
})

// Infer the schema type for state
type Schema = InferType<typeof schema>

// Create a reactive state with proper initial values
const state = reactive<Schema>({
    email: '',
    password: ''
})

// Handle form submission
async function onSubmit(event: FormSubmitEvent<Schema>) {
    try {
        console.log('Form Data:', event.data) // Log submitted data
    } catch (error) {
        console.error('Submission error:', error)
    }
}
</script>

<template>
    <div>
        <UCard>
            <UCardHeader>
                <h2 class="text-xl font-semibold">Events</h2>
            </UCardHeader>
            <UCardBody>
                <UList>
                    <UListItem>
                        <ULink href="/events/1">Event 1</ULink>
                    </UListItem>
                    <UListItem>
                        <ULink href="/events/2">Event 2</ULink>
                    </UListItem>
                    <UListItem>
                        <ULink href="/events/3">Event 3</ULink>
                    </UListItem>
                </UList>
            </UCardBody>
        </UCard>

        <!-- Form with schema validation -->
        <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
            <!-- Email input -->
            <UFormGroup label="Email" name="email">
                <UInput v-model="state.email" />
            </UFormGroup>

            <!-- Password input -->
            <UFormGroup label="Password" name="password">
                <UInput v-model="state.password" type="password" />
            </UFormGroup>

            <!-- Submit button -->
            <UButton type="submit">
                Submit
            </UButton>
        </UForm>
    </div>
</template>
