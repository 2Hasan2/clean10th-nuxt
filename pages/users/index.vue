<script setup lang="ts">
import debounce from 'lodash/debounce';
definePageMeta({
  breadcrumb: {
    label: 'create',
    icon: 'catppuccin:folder-admin'
  },
  requiresAuth: true,
});

const columns = [
  {
    key: 'name',
    label: 'Name',
    sortable: true,
  },
  {
    key: 'email',
    label: 'Email',
    sortable: true,
  },
  {
    key: 'role',
    label: 'Role',
    sortable: true,
  },
  {
    key: 'actions',
    label: 'Actions',
  },
];

const name = ref('');
const email = ref('');
const page = ref(1);
const limit = ref(5);
const sortBy = ref('name');
const sortOrder = ref('asc');
const loading = ref(true);

const users = ref<any>([]);
const totalCount = ref(0);
const totalPages = ref(0);

const fetchUsers = async () => {
  loading.value = true;
  try {
    const response = await $fetch('/api/users', {
      params: {
        name: name.value,
        email: email.value,
        page: page.value,
        limit: limit.value,
        sortBy: sortBy.value,
        sortOrder: sortOrder.value,
      },
    });

    users.value = response.users;
    totalCount.value = response.totalCount;
    totalPages.value = response.totalPages;
  } catch (error) {
    console.error('Error fetching users:', error);
  } finally {
    loading.value = false;
  }
};

const debouncedFetchUsers = debounce(fetchUsers, 300);

watch([name, email], debouncedFetchUsers);

watch([page, limit, sortBy, sortOrder], fetchUsers);

onMounted(fetchUsers);

const deleteUser = async (user: any) => {
  if (confirm(`Are you sure you want to delete "${user.name}"?`)) {
    try {
      await $fetch(`/api/users/${user.id}`, {
        method: 'DELETE',
      });
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  }
};

const items = (row: any) => [
  [
    {
      label: 'View',
      icon: 'i-heroicons-eye-20-solid',
      click: () => navigateTo(`/users/${row.id}`),
    },
    {
      label: 'Edit',
      icon: 'i-heroicons-pencil-square-20-solid',
      click: () => navigateTo(`/users/${row.id}/edit`),
    },
    {
      label: 'Delete',
      icon: 'i-heroicons-trash-20-solid',
      click: () => deleteUser(row),
    },
  ],
];
</script>

<template>
  <div>
    <div class="flex justify-between px-3 py-3.5 border-b border-gray-200 dark:border-gray-700">
      <UInput v-model="name" placeholder="Filter users by name..." />
      <UInput v-model="email" placeholder="Filter users by email..." />
      <UButton to="/users/create">
        <template #leading>
          <UIcon name="lucide:user-plus" class="w-5 h-5" />
        </template>
        <span>Add</span>
      </UButton>
    </div>

    <UTable
      :loading="loading"
      :loading-state="{ icon: 'i-heroicons-arrow-path-20-solid', label: 'Loading...' }"
      :progress="{ color: 'primary', animation: 'carousel' }"
      :rows="users"
      :columns="columns"
    >
      <template #name-data="{ row }">
        <ULink
          :to="`/users/${row.id}`"
          active-class="text-primary-800"
          inactive-class="text-primary-500 dark:text-primary-400 hover:text-gray-700 dark:hover:text-gray-200"
        >
          {{ row.name }}
        </ULink>
      </template>

      <template #actions-data="{ row }">
        <UDropdown :items="items(row)">
          <UButton color="gray" variant="ghost" icon="i-heroicons-ellipsis-horizontal-20-solid" />
        </UDropdown>
      </template>
      <template #empty-state>
        <div class="flex flex-col items-center justify-center py-6 gap-3">
          <span class="italic text-sm">No users found</span>
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
