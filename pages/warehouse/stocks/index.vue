<script setup lang="ts">
import debounce from 'lodash/debounce';
import type {Product, Stock} from '@prisma/client';
definePageMeta({
  breadcrumb: {
    label: 'Stocks',
    icon: 'catppuccin:taskfile',
  },
});

const columns = [
  {
    key: 'name',
    label: 'Name',
    sortable: true,
  },
  {
    key:'stock',
    label: 'Stock',
    sortable: true,
  },
  {
    key: 'price',
    label: 'Price',
    sortable: true,
  },
  {
    key: 'actions',
    label: 'Actions',
  },
];

const name = ref('');
const description = ref('');
const page = ref(1);
const limit = ref(5);
const sortOrder = ref('asc');
const loading = ref(true);

const products = ref<(Product &{stock: Stock})[]>([]);
const totalCount = ref(0);
const totalPages = ref(0);

const fetchProducts = async () => {
    loading.value = true;
  try {
    const response = await $fetch('/api/products/stock', {
      params: {
        name: name.value,
        description: description.value,
        page: page.value,
        limit: limit.value,
        sortOrder: sortOrder.value,
      },
    });

    products.value = response.products.map((product: any) => ({
      ...product,
      createdAt: new Date(product.createdAt),
      updatedAt: new Date(product.updatedAt),
      stock: product.stock ? {
        ...product.stock,
        createdAt: new Date(product.stock.createdAt),
        updatedAt: new Date(product.stock.updatedAt),
      } : null,
    }));
    totalCount.value = response.totalCount;
    totalPages.value = response.totalPages;
  } catch (error) {
    console.error('Error fetching products:', error);
  } finally {
    loading.value = false;
  }
};

const debouncedFetchProducts = debounce(fetchProducts, 300);

watch([name, description], debouncedFetchProducts);

watch([page, limit, sortOrder], fetchProducts);

onMounted(fetchProducts);

const deleteProduct= async (product: any) => {
  if (confirm(`Are you sure you want to delete "${product.name}"?`)) {
    try {
      await $fetch(`/api/products/${product.id}`, {
        method: 'DELETE',
      });
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  }
};

</script>

<template>
  <div>
    <div class="flex justify-between px-3 py-3.5 border-b border-gray-200 dark:border-gray-700">
        <UInput v-model="name" placeholder="Filter people..." />
        <UButton to="/warehouse/products/create">
            <template #leading>
                <UIcon name="lucide:package-plus" class="w-5 h-5" />
            </template>
            <span>Add</span>
        </UButton>
    </div>

    <UTable 
    :loading="loading"
    :loading-state="{ icon: 'i-heroicons-arrow-path-20-solid', label: 'Loading...' }"
    :progress="{ color: 'primary', animation: 'carousel' }"
    :rows="products" 
    :columns="columns">
    <template #name-data="{ row }">
      <ULink 
      :to="`/warehouse/products/${row.id}`"
      :class="row.stock?.quantity > 0 ? 'text-green-500 dark:text-green-400 hover:text-green-700 dark:hover:text-green-200' : 'text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-200'"
      inactive-class="text-primary-500 dark:text-primary-400 hover:text-gray-700 dark:hover:text-gray-200"
      >{{ row.name }}</ULink>
    </template>

    <template #stock-data="{ row }">
          <span>{{ row.stock?.quantity || 0 }}</span>
    </template>

    <template #actions-data="{ row }">
        <UButtonGroup>
            <UButton color="blue" @click="navigateTo(`/warehouse/stocks/${row.stock?.id}`)">
                Edit
            </UButton>
        </UButtonGroup>
    </template>
    <template #empty-state>
      <div class="flex flex-col items-center justify-center py-6 gap-3">
        <span class="italic text-sm">No products found</span>
      </div>
    </template>
    </UTable>

    <div class="flex justify-end px-3 py-3.5 border-t border-gray-200 dark:border-gray-700">
      <UPagination 
        v-model="page" 
        :page-count="limit" 
        :total="totalCount" 
        />
    </div>
  </div>
</template>
