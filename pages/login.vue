<script setup lang="ts">
import { object, string, type InferType } from 'yup'
import type { FormSubmitEvent } from '#ui/types'
import { useAuthStore } from '@/stores/auth';

definePageMeta({
    breadcrumb: {
        label: 'login',
        icon: 'catppuccin:folder'
    },
    layout: 'login',
});

const loading = ref(false);
const toast = useToast();
const router = useRouter();
const auth = useAuthStore();

const schema = object({
    email: string().email('Invalid email').required('Required'),
    password: string().required('Required'),
})

type Schema = InferType<typeof schema>

const state = reactive<Schema>({
    email: '',
    password: '',
})

async function onSubmit(event: FormSubmitEvent<Schema>) {
    loading.value = true
    try {
        await auth.login(event.data)
        toast.add({
            title: 'User logged in',
            timeout: 1000,
        })
    } catch (error) {
        toast.add({
            title: 'Error logging in',
            description: String(error) || 'An error occurred',
            color: 'red'
        })
    } finally {
        loading.value = false
    }
}

if (auth.isAuthenticated) {
    router.push('/')
}

</script>

<template>
    <div>
        <UCard>
            <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
                <UFormGroup label="Email" name="email">
                    <UInput v-model="state.email" />
                </UFormGroup>
                <UFormGroup label="Password" name="password">
                    <UInput v-model="state.password" type="password" />
                </UFormGroup>
                <UButton type="submit" :loading="loading" color="primary">Login</UButton>
            </UForm>
        </UCard>
    </div>    
</template>
