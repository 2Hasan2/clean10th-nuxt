<script setup lang="ts">
definePageMeta({
    breadcrumb: {
        label: 'edit',
        icon: 'catppuccin:folder'
    },
});
</script>

<template>
    <div>
        edit for {{ $route.params.id }}
    </div>
</template>
