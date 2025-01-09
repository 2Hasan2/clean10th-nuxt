<script setup lang="ts">
definePageMeta({
    breadcrumb: {
        label: 'edit',
        icon: 'catppuccin:folder'
    },
    requiresAuth: true,
    middleware: ['role'],
    role: [],
});
</script>

<template>
    <UnderDevelopment />
</template>
