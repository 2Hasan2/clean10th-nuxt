<script setup lang="ts">
definePageMeta({
    breadcrumb: {
        label: 'Home',
        icon: 'catppuccin:folder'
    },
    requiresAuth: true,
});
const auth = useAuthStore();
</script>

<template>
    <div class="flex flex-wrap gap-2">
        <UCard class="min-w-1/4 max-w-full">
            <template #header>
                <h2 class="text-lg font-semibold">Warehouse</h2>
            </template>
            <UButtonGroup>
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

                <UButton to="/warehouse/stocks">
                    <template #leading>
                        <UIcon name="lucide:package-plus" class="w-5 h-5" />
                    </template>
                    <span>stocks</span>
                </UButton>
            </UButtonGroup>
        </UCard>

        <UCard class="min-w-1/4 max-w-full">
            <template #header>
                <h2 class="text-lg font-semibold">Orders</h2>
            </template>
            <div class="flex space-x-4">
                <UButton to="/orders">
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
