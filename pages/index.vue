<script setup lang="ts">
definePageMeta({
    breadcrumb: {
        label: 'Home',
        icon: 'catppuccin:folder'
    },
});
</script>

<template>
    <div class="flex flex-wrap gap-2">

        <UCard class="min-w-1/4 max-w-full">
            <template #header>
                <h2 class="text-lg font-semibold">Warehouse</h2>
            </template>
            <div class="flex space-x-4">
                <UButton to="/warehouse/products">
                    <template #leading>
                        <UIcon name="lucide:package-plus" class="w-5 h-5" />
                    </template>
                    <span>Products</span>
                </UButton>

                <UButton to="/warehouse/categories">
                    <template #leading>
                        <UIcon name="lucide:package-plus" class="w-5 h-5" />
                    </template>
                    <span>Categories</span>
                </UButton>
            </div>
        </UCard>

        <UCard class="min-w-1/4 max-w-full">
            <template #header>
                <h2 class="text-lg font-semibold">Orders</h2>
            </template>
            <div class="flex space-x-4">
                <UButton to="/orders/products">
                    <template #leading>
                        <UIcon name="lucide:package-plus" class="w-5 h-5" />
                    </template>
                    <span>Orders</span>
                </UButton>
            </div>
        </UCard>

        <UCard class="min-w-1/4 max-w-full">
            <template #header>
                <h2 class="text-lg font-semibold">POS</h2>
            </template>
            <div class="flex space-x-4">
                <UButton to="/pos">
                    <template #leading>
                        <UIcon name="lucide:package-plus" class="w-5 h-5" />
                    </template>
                    <span>point of sale</span>
                </UButton>
            </div>
        </UCard>
    </div>
</template>
