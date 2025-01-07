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
const loading = ref(true);

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

const items = (row:any) => [
  [
  {
    label: 'View',
    icon: 'i-heroicons-eye-20-solid',
    click: () => navigateTo(`/stock/products/${row.id}`),
  },  
  {
    label: 'Edit',
    icon: 'i-heroicons-pencil-square-20-solid',
    click: () => navigateTo(`/stock/products/${row.id}/edit`),
  },{
    label: 'Delete',
    icon: 'i-heroicons-trash-20-solid',
    click: () => deleteProduct(row),
  }]
];
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
    :columns="columns">
    <template #name-data="{ row }">
      <ULink 
      :to="`/stock/products/${row.id}`"
      active-class="text-primary-800"
      inactive-class="text-primary-500 dark:text-primary-400 hover:text-gray-700 dark:hover:text-gray-200"
      >{{ row.name }}</ULink>
    </template>

    <template #actions-data="{ row }">
      <UDropdown :items="items(row)">
        <UButton color="gray" variant="ghost" icon="i-heroicons-ellipsis-horizontal-20-solid" />
      </UDropdown>
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
