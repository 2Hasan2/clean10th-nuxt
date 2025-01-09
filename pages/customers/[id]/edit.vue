<script setup lang="ts">
definePageMeta({
    breadcrumb: {
        label: 'edit',
        icon: 'catppuccin:folder'
    },
    requiresAuth: true,
    middleware: ['role'],
    role: ['CASHIER'],
});
</script>

<template>
    <UnderDevelopment />
</template>
