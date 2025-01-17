<script setup lang="ts">
import type { Product, Category, Stock } from "@prisma/client";

definePageMeta({
  breadcrumb: {
    label: "view",
    icon: "catppuccin:folder",
  },
  requiresAuth: true,
  middleware: ["role"],
  role: ["CASHIER", "ACCOUNTANT"],
});

const product = ref<
  (Product & { category: Category; stock: Stock | null }) | null
>(null);

const route = useRoute();
const router = useRouter();

const fetchProduct = async () => {
  try {
    const res = await $fetch<
      Product & { category: Category; stock: Stock | null }
    >(`/api/products/${route.params.id}`);
    if ("error" in res) {
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
        updatedAt: new Date(res.category.updatedAt),
      },
      stock: res.stock
        ? {
            ...res.stock,
            createdAt: new Date(res.stock.createdAt),
            updatedAt: new Date(res.stock.updatedAt),
          }
        : null,
    };
  } catch (error) {
    console.error(error);
  }
};
const deleteProduct = async (id: string) => {
  if (confirm("Are you sure you want to delete ?")) {
    try {
      await $fetch(`/api/products/${id}`, {
        method: "DELETE",
      });
      router.push("/warehouse/products");
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  }
};
onMounted(() => {
  fetchProduct();
});
</script>

<template>
  <div class="flex flex-col" v-if="product">
    <UCard :ui="{ padding: 'p-4', background: 'bg-white dark:bg-gray-800' }">
      <div class="flex flex-col gap-4">
        <div class="flex justify-between items-center">
          <div class="flex flex-col space-y-2">
            <div class="flex gap-4 items-center">
              <h1 class="text-2xl font-bold">
                {{ product.name }}
              </h1>
              <span class="text-sm text-gray-600"> ID: {{ product.id }} </span>
            </div>
            <div class="flex items-center space-x-2 mt-2">
              <UIcon
                name="fluent-emoji-flat:tag"
                class="w-5 h-5 text-gray-400"
              />
              <ULink
                :to="`/warehouse/categories/${product.category.id}`"
                active-class="text-primary-800"
                inactive-class="text-primary-500 dark:text-primary-400 hover:text-gray-700 dark:hover:text-gray-200"
              >
                <span class="text-gray-400"> Category: </span>
                <span>
                  {{ product.category.name }}
                </span>
              </ULink>
            </div>
            <div class="flex items-center space-x-2 mt-2" v-if="product.stock">
              <UIcon
                name="fluent-emoji-flat:tag"
                class="w-5 h-5 text-gray-400"
              />
              <ULink
                :to="`/warehouse/stocks/${product.stock.id}`"
                active-class="text-primary-800"
                inactive-class="text-primary-500 dark:text-primary-400 hover:text-gray-700 dark:hover:text-gray-200"
              >
                <span class="text-gray-400"> Quantity: </span>
                <span>
                  {{ product.stock?.quantity ?? 0 }}
                </span>
              </ULink>
            </div>
          </div>
          <div class="flex items-center">
            <span class="text-sm text-gray-600">
              {{ product.description }}
            </span>
          </div>
          <div
            class="flex items-center gap-2"
            v-if="$user.value?.role === 'ADMIN'"
          >
            <UButton :to="`/warehouse/products/${product.id}/edit`">
              Edit
            </UButton>
            <UButton @click="deleteProduct(product.id)" color="red">
              Delete
            </UButton>
          </div>
        </div>
        <div class="flex flex-col gap-2">
          <div class="flex items-center space-x-2">
            <UIcon
              name="fluent-emoji-flat:eight-oclock"
              class="w-5 h-5 text-gray-400"
            />
            <span class="text-gray-400">
              Created At: {{ product.createdAt }}
            </span>
          </div>
          <div class="flex items-center space-x-2">
            <UIcon
              name="fluent-emoji-flat:ten-oclock"
              class="w-5 h-5 text-gray-400"
            />
            <span class="text-gray-400">
              Updated At: {{ product.updatedAt }}
            </span>
          </div>
        </div>
      </div>
    </UCard>
  </div>
  <div v-else>
    <UCard :ui="{ padding: 'p-4', background: 'bg-white dark:bg-gray-700' }">
      <div class="flex flex-col gap-4">
        <div class="flex justify-between items-center">
          <div class="flex flex-col space-y-2">
            <div class="flex gap-4 items-center">
              <USkeleton class="h-8 w-[150px]" />
              <USkeleton class="h-4 w-[80px]" />
            </div>
            <div class="flex items-center space-x-2 mt-2">
              <USkeleton class="h-5 w-5" :ui="{ rounded: 'rounded-full' }" />
              <USkeleton class="h-4 w-[100px]" />
            </div>
          </div>
          <div class="flex items-center">
            <USkeleton class="h-4 w-[250px]" />
          </div>
          <div class="flex items-center">
            <USkeleton class="h-8 w-[80px]" />
          </div>
        </div>
        <div class="flex flex-col gap-2">
          <div class="flex items-center space-x-2">
            <USkeleton class="h-5 w-5" :ui="{ rounded: 'rounded-full' }" />
            <USkeleton class="h-4 w-[180px]" />
          </div>
          <div class="flex items-center space-x-2">
            <USkeleton class="h-5 w-5" :ui="{ rounded: 'rounded-full' }" />
            <USkeleton class="h-4 w-[180px]" />
          </div>
        </div>
      </div>
    </UCard>
  </div>
</template>
