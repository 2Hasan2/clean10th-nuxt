<script setup lang="ts">
import debounce from "lodash/debounce";
definePageMeta({
  breadcrumb: {
    label: "Categories",
    icon: "catppuccin:taskfile",
  },
  requiresAuth: true,
  middleware: ["role"],
  role: ["CASHIER", "ACCOUNTANT"],
});

const columns = [
  {
    key: "name",
    label: "Name",
    sortable: true,
  },
];
const { $user } = useNuxtApp();

if ($user.value?.role === "ADMIN") {
  columns.push({
    key: "actions",
    label: "Actions",
    sortable: false,
  });
}

const name = ref("");
const description = ref("");
const page = ref(1);
const limit = ref(5);
const sortBy = ref("name");
const sortOrder = ref("asc");
const loading = ref(true);

const categories = ref<any>([]);
const totalCount = ref(0);
const totalPages = ref(0);

const fetchCategories = async () => {
  loading.value = true;
  try {
    const response = await $fetch("/api/categories", {
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
    console.error("Error fetching categories:", error);
  } finally {
    loading.value = false;
  }
};

const debouncedFetchCategories = debounce(fetchCategories, 300);

watch([name, description], debouncedFetchCategories);

watch([page, limit, sortBy, sortOrder], fetchCategories);

onMounted(fetchCategories);

const deleteCategory = async (id: string) => {
  if (confirm("Are you sure you want to delete ?")) {
    try {
      await $fetch(`/api/categories/${id}`, {
        method: "DELETE",
      });
      fetchCategories();
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  }
};

const items = (row: any) => {
  const content = [
    {
      label: "Edit",
      icon: "i-heroicons-pencil-square-20-solid",
      click: () => navigateTo(`/warehouse/categories/${row.id}/edit`),
    },
    {
      label: "Delete",
      icon: "i-heroicons-trash-20-solid",
      click: () => deleteCategory(row),
    },
  ];

  return [content];
};
</script>

<template>
  <div>
    <div
      class="flex justify-between px-3 py-3.5 border-b border-gray-200 dark:border-gray-700"
    >
      <UInput v-model="name" placeholder="Filter categories..." />
      <UButton to="/warehouse/categories/create">
        <template #leading>
          <UIcon name="lucide:package-plus" class="w-5 h-5" />
        </template>
        <span>Add</span>
      </UButton>
    </div>

    <UTable
      :loading="loading"
      :loading-state="{
        icon: 'i-heroicons-arrow-path-20-solid',
        label: 'Loading...',
      }"
      :progress="{ color: 'primary', animation: 'carousel' }"
      :rows="categories"
      :columns="columns"
    >
      <template #name-data="{ row }">
        <ULink
          :to="`/warehouse/categories/${row.id}`"
          active-class="text-primary-800"
          inactive-class="text-primary-500 dark:text-primary-400 hover:text-gray-700 dark:hover:text-gray-200"
        >
          {{ row.name }}
        </ULink>
      </template>
      <template #actions-data="{ row }">
        <UDropdown :items="items(row)">
          <UButton
            color="gray"
            variant="ghost"
            icon="i-heroicons-ellipsis-horizontal-20-solid"
          />
        </UDropdown>
      </template>
      <template #empty-state>
        <div class="flex flex-col items-center justify-center py-6 gap-3">
          <span class="italic text-sm">No categories found</span>
        </div>
      </template>
    </UTable>

    <div
      class="flex justify-end px-3 py-3.5 border-t border-gray-200 dark:border-gray-700"
    >
      <UPagination v-model="page" :page-count="limit" :total="totalCount" />
    </div>
  </div>
</template>
