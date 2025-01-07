<script setup lang="ts">
definePageMeta({
    breadcrumb: {
        label: 'edit',
        icon: 'catppuccin:folder'
    },
});
</script>

<template>
    edit for {{ $route.params.id }}
</template>
