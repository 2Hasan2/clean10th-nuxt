<script setup lang="ts">
import debounce from 'lodash/debounce';
definePageMeta({
  breadcrumb: {
    label: 'Categories',
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
const selected = ref<any>([]);

const categories = ref<any>([]);
const totalCount = ref(0);
const totalPages = ref(0);

const fetchCategories = async () => {
  loading.value = true;
  try {
    const response = await $fetch('/api/categories', {
      params: {
        name: name.value,
        description: description.value,
        page: page.value,
        limit: limit.value,
        sortBy: sortBy.value,
        sortOrder: sortOrder.value,
      },
    });

    categories.value = response.categories;
    totalCount.value = response.totalCount;
    totalPages.value = response.totalPages;
  } catch (error) {
    console.error('Error fetching categories:', error);
  } finally {
    loading.value = false;
  }
};

const debouncedFetchCategories = debounce(fetchCategories, 300);

watch([name, description], debouncedFetchCategories);

watch([page, limit, sortBy, sortOrder], fetchCategories);

onMounted(fetchCategories);

const deleteCategory = async (category: any) => {
  console.log('Delete category:', category);
  if (confirm(`Are you sure you want to delete "${category.name}"?`)) {
    try {
      await $fetch(`/api/categories/${category.id}`, {
        method: 'DELETE',
      });
      fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  }
};

const items = (row:any) => [
  [{
    label: 'Edit',
    icon: 'i-heroicons-pencil-square-20-solid',
    click: () => navigateTo(`/stock/categories/${row.id}/edit`),
  },{
    label: 'Delete',
    icon: 'i-heroicons-trash-20-solid',
    click: () => deleteCategory(row),
  }]
];
</script>

<template>
  <div>
    <div class="flex justify-between px-3 py-3.5 border-b border-gray-200 dark:border-gray-700">
      <UInput v-model="name" placeholder="Filter categories..." />
      <UButton to="/stock/categories/create">
        <template #leading>
          <UIcon name="lucide:package-plus" class="w-5 h-5" />
        </template>
        <span>Add</span>
      </UButton>
    </div>

    <UTable 
    v-model="selected"
      :loading="loading"
      :loading-state="{ icon: 'i-heroicons-arrow-path-20-solid', label: 'Loading...' }"
      :progress="{ color: 'primary', animation: 'carousel' }"
      :rows="categories" 
      :columns="columns">
      <template #name-data="{ row }">
      <span :class="[categories.find((category:any) => category.id === row.id) && 'text-primary-500 dark:text-primary-400']">{{ row.name }}</span>
    </template>

    <template #actions-data="{ row }">
      <UDropdown :items="items(row)">
        <UButton color="gray" variant="ghost" icon="i-heroicons-ellipsis-horizontal-20-solid" />
      </UDropdown>
    </template>
    <template #empty-state>
      <div class="flex flex-col items-center justify-center py-6 gap-3">
        <span class="italic text-sm">No categories found</span>
        <UButton label="Create a category" to="/stock/categories/create" />
      </div>
    </template>
    </UTable>

    <div class="flex justify-end px-3 py-3.5 border-t border-gray-200 dark:border-gray-700">
      <UPagination 
        v-model="page" 
        :page-count="totalPages" 
        :total="totalCount" 
      />
    </div>
  </div>
</template>
