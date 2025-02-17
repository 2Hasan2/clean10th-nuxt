<script setup lang="ts">
definePageMeta({
  breadcrumb: {
    label: "view",
    icon: "catppuccin:folder",
  },
  requiresAuth: true,
  middleware: ["role"],
  role: ["CASHIER"],
});
const customer = ref<any | null>(null);

const route = useRoute();
const loading = ref(true);
const router = useRouter();
const toast = useToast();

const fetchCustomer = async () => {
  loading.value = true;
  try {
    const res = await $fetch(`/api/customers/${route.params.id}`);
    if ("error" in res) {
      console.error(res.error);
      return;
    }
    customer.value = res;
  } catch (error) {
    console.error(error);
    toast.add({
      title: "Error fetching customer",
      description: (error as any)?.data?.error || (error as any)?.message,
      color: "red",
    });
  } finally {
    loading.value = false;
  }
};
const deleteCustomer = async (id: string) => {
  if (confirm("Are you sure you want to delete ?")) {
    try {
      await $fetch(`/api/customers/${id}`, {
        method: "DELETE",
      });
      router.push("/customers");
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  }
};
onMounted(() => {
  fetchCustomer();
});
</script>

<template>
  <div class="flex flex-col" v-if="!loading && customer">
    <UCard :ui="{ padding: 'p-4', background: 'bg-white dark:bg-gray-800' }">
      <div class="flex flex-col gap-4">
        <div class="flex justify-between items-center">
          <div class="flex flex-col space-y-2">
            <div class="flex gap-4 items-center">
              <h1 class="text-2xl font-bold">
                {{ customer.name }}
              </h1>
              <span class="text-sm text-gray-600"> ID: {{ customer.id }} </span>
            </div>
            <div class="flex items-center space-x-2 mt-2">
              <UIcon
                name="fluent-emoji-flat:tag"
                class="w-5 h-5 text-gray-400"
              />
              <span class="text-gray-400">
                {{ customer.address }}
              </span>
            </div>
          </div>
          <div class="flex items-center">
            <span class="text-sm text-gray-600">
              {{ customer.email }}
            </span>
          </div>
          <div class="flex items-center">
            <!-- <UButton :to="`/customers/${customer.id}/edit`">
                            Edit
                        </UButton> -->
            <UButton
              @click="deleteCustomer(customer.id)"
              color="red"
              class="ml-2"
              v-if="$user.value?.role === 'ADMIN'"
            >
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
              Created At: {{ customer.createdAt }}
            </span>
          </div>
          <div class="flex items-center space-x-2">
            <UIcon
              name="fluent-emoji-flat:ten-oclock"
              class="w-5 h-5 text-gray-400"
            />
            <span class="text-gray-400">
              Updated At: {{ customer.updatedAt }}
            </span>
          </div>
        </div>
      </div>
    </UCard>
  </div>
  <div v-else-if="loading">
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
