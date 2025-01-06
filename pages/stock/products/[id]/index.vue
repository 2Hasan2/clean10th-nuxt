<script setup lang="ts">
import type { Product, Category } from"@prisma/client";

definePageMeta({
    breadcrumb: {
        label:  "view",
        icon: 'catppuccin:folder'
    },
});

const product = ref<Product & { category: Category } | null>(null);

const route = useRoute()

const fetchProduct = async () => {
    try {
        const res = await $fetch(`/api/products/${route.params.id}`);
        if ('error' in res) {
            console.error(res.error);
            return;
        }
        product.value = {
            ...res,
            createdAt: new Date(res.createdAt),
            updatedAt: new Date(res.updatedAt),
            category: {
                ...res.category,
                createdAt: new Date(res.category.createdAt),
                updatedAt: new Date(res.category.updatedAt)
            }
        };
    } catch (error) {
        console.error(error);
    }
};

onMounted(() => {
    fetchProduct();
});

</script>

<template>
    <div v-if="product">
        <h1>{{ product.name }}</h1>
        <p>{{ product.description }}</p>
    </div>
    <div v-else>
        <p>Loading...</p>
    </div>
</template>
