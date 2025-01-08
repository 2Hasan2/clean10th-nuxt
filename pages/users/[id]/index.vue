<script>
definePageMeta({
  breadcrumb: {
    label: 'Users',
    icon: 'catppuccin:folder-admin'
  },
  requiresAuth: true,
});
</script>

<template>
    index for {{ $route.params.id }}
</template>