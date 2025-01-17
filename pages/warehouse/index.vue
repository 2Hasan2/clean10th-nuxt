<script setup lang="ts">
definePageMeta({
  breadcrumb: {
    label: "Warehouse",
    icon: "catppuccin:folder-packages",
  },
  requiresAuth: true,
  middleware: ["role"],
  role: ["CASHIER", "ACCOUNTANT"],
});
</script>
<template>
  <div class="flex space-x-4">
    <UButton to="/warehouse/products">
      <template #leading>
        <UIcon name="lucide:package-plus" class="w-5 h-5" />
      </template>
      <span>Products</span>
    </UButton>

    <UButton to="/warehouse/categories">
      <template #leading>
        <UIcon name="lucide:package-plus" class="w-5 h-5" />
      </template>
      <span>Categories</span>
    </UButton>

    <UButton to="/warehouse/stocks">
      <template #leading>
        <UIcon name="lucide:package-plus" class="w-5 h-5" />
      </template>
      <span>stocks</span>
    </UButton>
  </div>
</template>
