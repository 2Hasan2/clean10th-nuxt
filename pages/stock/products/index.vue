<script setup lang="ts">
import debounce from 'lodash/debounce';
definePageMeta({
  breadcrumb: {
    label: 'Products',
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
    key: 'description',
    label: 'Description',
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
const sortBy = ref('name');
const sortOrder = ref('asc');
const loading = ref(false);

const products = ref<any>([]);
const totalCount = ref(0);
const totalPages = ref(0);

const fetchProducts = async () => {
    loading.value = true;
  try {
    const response = await $fetch('/api/products', {
      params: {
        name: name.value,
        description: description.value,
        page: page.value,
        limit: limit.value,
        sortBy: sortBy.value,
        sortOrder: sortOrder.value,
      },
    });

    products.value = response.products;
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

watch([page, limit, sortBy, sortOrder], fetchProducts);

onMounted(fetchProducts);
</script>

<template>
  <div>
    <div class="flex justify-between px-3 py-3.5 border-b border-gray-200 dark:border-gray-700">
        <UInput v-model="name" placeholder="Filter people..." />
        <UButton to="/stock/products/create">
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
    :columns="columns"/>

    <div class="flex justify-end px-3 py-3.5 border-t border-gray-200 dark:border-gray-700">
      <UPagination 
        v-model="page" 
        :page-count="limit" 
        :total="totalCount" 
        />
    </div>
  </div>
</template>
