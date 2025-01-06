<script setup lang="ts">
definePageMeta({
  breadcrumb: {
    label: 'Stock',
    icon: 'catppuccin:folder-packages'
  },
});
</script>
<template>
    <div class="flex space-x-4">
        <UButton to="/stock/products">
            <template #leading>
                <UIcon name="lucide:package-plus" class="w-5 h-5" />
            </template>
            <span>Products</span>
        </UButton>
        
        <UButton to="/stock/categories">
            <template #leading>
                <UIcon name="lucide:package-plus" class="w-5 h-5" />
            </template>
            <span>Categories</span>
        </UButton>
    </div>
</template>
