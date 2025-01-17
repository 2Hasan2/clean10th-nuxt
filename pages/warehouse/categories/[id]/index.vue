<script setup lang="ts">
import type { Category, Product } from "@prisma/client";

definePageMeta({
  breadcrumb: {
    label: "view",
    icon: "catppuccin:folder",
  },
  requiresAuth: true,
  middleware: ["role"],
  role: ["CASHIER", "ACCOUNTANT"],
});

const category = ref<
  (Category & { products: Product[]; parent: Category | null }) | null
>(null);

const route = useRoute();
const router = useRouter();

const fetchCategory = async () => {
  try {
    const res = await $fetch(`/api/categories/${route.params.id}`);
    if ("error" in res) {
      console.error(res.error);
      return;
    }
    category.value = {
      ...res,
      createdAt: new Date(res.createdAt),
      updatedAt: new Date(res.updatedAt),
      products: res.products.map((product) => ({
        ...product,
        createdAt: new Date(product.createdAt),
        updatedAt: new Date(product.updatedAt),
      })),
      parent: res.parent
        ? {
            ...res.parent,
            createdAt: new Date(res.parent.createdAt),
            updatedAt: new Date(res.parent.updatedAt),
          }
        : null,
    };
  } catch (error) {
    console.error(error);
  }
};
const toast = useToast();

const deleteCategory = async (id: string) => {
  if (category.value?.products.length) {
    toast.add({
      title: "Warning",
      description:
        "This category has products. Please delete the products first.",
      timeout: 2000,
      color: "yellow",
    });
    return;
  }
  if (confirm("Are you sure you want to delete ?")) {
    try {
      await $fetch(`/api/categories/${id}`, {
        method: "DELETE",
      });
      router.push("/warehouse/categories");
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  }
};

onMounted(() => {
  fetchCategory();
});
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex flex-col" v-if="category">
      <UCard :ui="{ padding: 'p-4', background: 'bg-white dark:bg-gray-800' }">
        <div class="flex flex-col gap-4">
          <div class="flex justify-between items-center">
            <div class="flex flex-col space-y-2">
              <div class="flex gap-4 items-center">
                <h1 class="text-2xl font-bold">
                  {{ category.name }}
                </h1>
                <span class="text-sm text-gray-600">
                  ID: {{ category.id }}
                </span>
              </div>
              <div
                class="flex items-center space-x-2 mt-2"
                v-if="category.parent"
              >
                <UIcon
                  name="fluent-emoji-flat:tag"
                  class="w-5 h-5 text-gray-400"
                />
                <span class="text-gray-400">
                  Parent: {{ category.parent.name }}
                  <ULink
                    :to="`/warehouse/categories/${category.parent.id}`"
                    active-class="text-primary-800"
                    inactive-class="text-primary-500 dark:text-primary-400 hover:text-gray-700 dark:hover:text-gray-200"
                  >
                    ({{ category.parent.id }})
                  </ULink>
                </span>
              </div>
            </div>
            <div class="flex items-center">
              <span class="text-sm text-gray-600">
                {{ category.description }}
              </span>
            </div>
            <div
              class="flex items-center gap-2"
              v-if="$user.value?.role === 'ADMIN'"
            >
              <UButton :to="`/warehouse/categories/${category.id}/edit`">
                Edit
              </UButton>
              <UButton
                @click="deleteCategory(category.id)"
                color="red"
                v-if="!category.parent"
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
                Created At: {{ category.createdAt }}
              </span>
            </div>
            <div class="flex items-center space-x-2">
              <UIcon
                name="fluent-emoji-flat:ten-oclock"
                class="w-5 h-5 text-gray-400"
              />
              <span class="text-gray-400">
                Updated At: {{ category.updatedAt }}
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

    <div v-if="category && category.products.length">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="product in category.products"
          :key="product.id"
          class="flex"
        >
          <UCard
            :ui="{ padding: 'p-4', background: 'bg-white dark:bg-gray-800' }"
            class="flex flex-col justify-between h-full"
          >
            <div>
              <div class="flex justify-between items-center">
                <div class="flex flex-col space-y-2">
                  <div class="flex flex-col gap-4">
                    <h1 class="text-2xl flex font-bold w-full">
                      {{ product.name }}
                    </h1>
                    <span
                      class="text-sm text-gray-600 whitespace-nowrap overflow-hidden text-ellipsis w-48"
                    >
                      ID:
                      <ULink
                        :to="`/warehouse/products/${product.id}`"
                        active-class="text-primary-800"
                        inactive-class="text-primary-500 text-sm dark:text-primary-400 hover:text-gray-700 dark:hover:text-gray-200"
                      >
                        {{ product.id }}
                      </ULink>
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div class="mt-4">
              <div class="flex flex-col gap-2">
                <div class="flex items-center space-x-2">
                  <UIcon
                    name="fluent-emoji-flat:eight-oclock"
                    class="w-5 h-5 text-gray-400"
                  />
                  <span class="text-gray-400">
                    Created At: {{ product.createdAt.toDateString() }}
                  </span>
                </div>
                <div class="flex items-center space-x-2">
                  <UIcon
                    name="fluent-emoji-flat:ten-oclock"
                    class="w-5 h-5 text-gray-400"
                  />
                  <span class="text-gray-400">
                    Updated At: {{ product.updatedAt.toDateString() }}
                  </span>
                </div>
              </div>
            </div>
          </UCard>
        </div>
      </div>
    </div>
    <div v-else-if="!category">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="n in 6" :key="n" class="flex items-center justify-center">
          <UCard
            :ui="{ padding: 'p-4', background: 'bg-white dark:bg-gray-700' }"
          >
            <div class="flex flex-col gap-4">
              <div class="flex justify-between items-center">
                <div class="flex flex-col space-y-2">
                  <div class="flex gap-4 items-center">
                    <USkeleton class="h-8 w-[150px]" />
                  </div>
                  <div class="flex items-center space-x-2 mt-2">
                    <USkeleton
                      class="h-5 w-full"
                      :ui="{ rounded: 'rounded-full' }"
                    />
                    <USkeleton class="h-4 w-[100px]" />
                  </div>
                </div>
                <div class="flex items-center">
                  <USkeleton class="h-4 w-full" />
                </div>
              </div>
              <div class="flex flex-col gap-2">
                <div class="flex items-center space-x-2">
                  <USkeleton
                    class="h-5 w-5"
                    :ui="{ rounded: 'rounded-full' }"
                  />
                  <USkeleton class="h-4 w-[180px]" />
                </div>
                <div class="flex items-center space-x-2">
                  <USkeleton
                    class="h-5 w-5"
                    :ui="{ rounded: 'rounded-full' }"
                  />
                  <USkeleton class="h-4 w-[180px]" />
                </div>
              </div>
            </div>
          </UCard>
        </div>
      </div>
    </div>
  </div>
</template>
