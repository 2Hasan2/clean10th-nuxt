<script setup lang="ts">
import debounce from 'lodash/debounce';
definePageMeta({
  breadcrumb: {
    label: 'Customers',
    icon: 'heroicons-outline:user-group',
  },
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
    key: 'phone',
    label: 'Phone',
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

const customers = ref<any>([]);
const totalCount = ref(0);
const totalPages = ref(0);

const fetchCustomers = async () => {
  loading.value = true;
  try {
    const response = await $fetch('/api/customers', {
      params: {
        name: name.value,
        email: email.value,
        page: page.value,
        limit: limit.value,
        sortBy: sortBy.value,
        sortOrder: sortOrder.value,
      },
    });

    customers.value = response.customers;
    totalCount.value = response.totalCount;
    totalPages.value = response.totalPages;
  } catch (error) {
    console.error('Error fetching customers:', error);
  } finally {
    loading.value = false;
  }
};

const debouncedFetchCustomers = debounce(fetchCustomers, 300);

watch([name, email], debouncedFetchCustomers);

watch([page, limit, sortBy, sortOrder], fetchCustomers);

onMounted(fetchCustomers);

const deleteCustomer = async (customer: any) => {
  console.log('Delete customer:', customer);
  if (confirm(`Are you sure you want to delete "${customer.name}"?`)) {
    try {
      await $fetch(`/api/customers/${customer.id}`, {
        method: 'DELETE',
      });
      fetchCustomers();
    } catch (error) {
      console.error('Error deleting customer:', error);
    }
  }
};

const items = (row: any) => [
  [
    {
      label: 'View',
      icon: 'i-heroicons-eye-20-solid',
      click: () => navigateTo(`/customers/${row.id}`),
    },
    {
      label: 'Edit',
      icon: 'i-heroicons-pencil-square-20-solid',
      click: () => navigateTo(`/customers/${row.id}/edit`),
    },
    {
      label: 'Delete',
      icon: 'i-heroicons-trash-20-solid',
      click: () => deleteCustomer(row),
    },
  ],
];
</script>

<template>
  <div>
    <div class="flex justify-between px-3 py-3.5 border-b border-gray-200 dark:border-gray-700">
      <UInput v-model="name" placeholder="Filter customers by name..." />
      <UInput v-model="email" placeholder="Filter customers by email..." class="ml-2" />
      <UButton to="/customers/create">
        <template #leading>
          <UIcon name="lucide:user-plus" class="w-5 h-5" />
        </template>
        <span>Add Customer</span>
      </UButton>
    </div>

    <UTable
      :loading="loading"
      :loading-state="{ icon: 'i-heroicons-arrow-path-20-solid', label: 'Loading...' }"
      :progress="{ color: 'primary', animation: 'carousel' }"
      :rows="customers"
      :columns="columns"
    >
      <template #name-data="{ row }">
        <ULink
          :to="`/customers/${row.id}`"
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
          <span class="italic text-sm">No customers found</span>
        </div>
      </template>
    </UTable>

    <div class="flex justify-end px-3 py-3.5 border-t border-gray-200 dark:border-gray-700">
      <UPagination v-model="page" :page-count="limit" :total="totalCount" />
    </div>
  </div>
</template>
