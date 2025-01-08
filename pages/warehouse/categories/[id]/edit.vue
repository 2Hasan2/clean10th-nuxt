<script setup lang="ts">
definePageMeta({
    breadcrumb: {
        label: 'edit',
        icon: 'catppuccin:folder'
    },
    requiresAuth: true,
});
</script>

<template>
    edit for {{ $route.params.id }}
</template>
