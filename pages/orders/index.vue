<script setup lang="ts">
import debounce from "lodash/debounce";
import { sub, add, format, isSameDay, type Duration } from "date-fns";
import type { Order, orderItem, Customer, Product } from "@prisma/client";
import { ConfirmModel } from "#components";

const toast = useToast();
definePageMeta({
  breadcrumb: {
    label: "Orders",
    icon: "catppuccin:folder-scripts",
  },
  requiresAuth: true,
  middleware: ["role"],
  role: ["ACCOUNTANT", "CASHIER"],
});

const columns = [
  {
    key: "customerName",
    label: "Customer Name",
    sortable: true,
  },
  {
    key: "total",
    label: "Total",
    sortable: true,
  },
  {
    key: "createdAt",
    label: "Date",
    sortable: true,
  },
  {
    key: "actions",
    label: "Actions",
  },
];

const customerName = ref("");
const rangeDate = ref({ start: sub(new Date(), { days: 1 }), end: new Date() });

const page = ref(1);
const limit = ref(20);
const sortBy = ref("createdAt");
const sortOrder = ref("desc");
const loading = ref(true);
const orders = ref<
  (Order & {
    orderItem: (orderItem & {
      product: Product;
    })[];
    customer: Customer;
  })[]
>([]);
const totalCount = ref(0);
const totalPrice = ref(0);
const totalPages = ref(0);

const fetchOrders = async () => {
  loading.value = true;
  try {
    const response = await $fetch("/api/orders", {
      params: {
        customerName: customerName.value,
        page: page.value,
        limit: limit.value,
        sortBy: sortBy.value,
        sortOrder: sortOrder.value,
        startDate: rangeDate.value.start.toISOString(),
        endDate: rangeDate.value.end.toISOString(),
      },
    });

    orders.value = response.orders.map((order: any) => ({
      ...order,
      createdAt: new Date(order.createdAt),
      orderItem: order.orderItem.map((item: any) => ({
        ...item,
        createdAt: new Date(item.createdAt),
        product: {
          ...item.product,
          createdAt: new Date(item.product.createdAt),
          updatedAt: new Date(item.product.updatedAt),
        },
        updatedAt: new Date(item.updatedAt),
      })),
      customer: {
        ...order.customer,
        createdAt: new Date(order.customer.createdAt),
        updatedAt: new Date(order.customer.updatedAt),
      },
      updatedAt: new Date(order.updatedAt),
      deletedAt: order.deletedAt ? new Date(order.deletedAt) : null,
    }));
    totalCount.value = response.totalCount;
    totalPrice.value = response.totalPrice;
    totalPages.value = response.totalPages;
  } catch (error) {
    console.error("Error fetching orders:", error);
    toast.add({
      title: "Error fetching orders",
      timeout: 1000,
      color: "red",
    });
  } finally {
    loading.value = false;
  }
};

const debouncedFetchOrders = debounce(fetchOrders, 300);

watch([customerName, rangeDate], debouncedFetchOrders);

watch([page, limit, sortBy, sortOrder], fetchOrders);

onMounted(fetchOrders);

const modal = useModal();

const deleteOrder = async (order: Order) => {
  modal.open(ConfirmModel, {
    title: "Delete this order?",
    onCancel: () => modal.close(),
    onDelete: async () => {
      try {
        await $fetch(`/api/orders/${order.id}`, {
          method: "DELETE",
        });
        fetchOrders();
        toast.add({
          title: "Order deleted",
          timeout: 1000,
        });
      } catch (error) {
        console.error("Error deleting order:", error);
        toast.add({
          title: "Error while deleting order",
          timeout: 1000,
          color: "red",
        });
      } finally {
        modal.close();
      }
    },
  });
};

const ranges: { label: string; duration: Duration & { start?: Date } }[] = [
  { label: "Today", duration: { days: 1 } },
  {
    label: "This Week",
    duration: {
      days: 7,
      start: new Date(
        new Date().setDate(new Date().getDate() - new Date().getDay())
      ),
    },
  },
  {
    label: "This Month",
    duration: {
      months: 1,
      start: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    },
  },
  {
    label: "This Year",
    duration: {
      years: 1,
      start: new Date(new Date().getFullYear(), 0, 1),
    },
  },
];

function isRangeSelected(duration: Duration & { start?: Date }) {
  return (
    isSameDay(
      rangeDate.value.start,
      sub(duration.start || new Date(), duration)
    ) &&
    isSameDay(
      rangeDate.value.end,
      duration.start ? add(duration.start, duration) : new Date()
    )
  );
}

function selectRange(duration: Duration & { start?: Date }) {
  rangeDate.value = {
    start: sub(duration.start || new Date(), duration),
    end: duration.start ? add(duration.start, duration) : new Date(),
  };
}
</script>

<template>
  <div class="max-h-full flex flex-col justify-between">
    <div class="flex items-center justify-between pb-4">
      <div class="flex gap-2">
        <UInput
          v-model="customerName"
          placeholder="Filter by customer name..."
        />
        <UPopover>
          <UButton icon="i-heroicons-calendar-days-20-solid">
            {{ format(rangeDate.start, "d MMM, yyy") }} -
            {{ format(rangeDate.end, "d MMM, yyy") }}
          </UButton>

          <template #panel="{ close }">
            <div
              class="flex items-center sm:divide-x divide-gray-200 dark:divide-gray-800"
            >
              <div class="hidden sm:flex flex-col py-4">
                <UButton
                  v-for="(range, index) in ranges"
                  :key="index"
                  :label="range.label"
                  color="gray"
                  variant="ghost"
                  class="rounded-none px-6"
                  :class="[
                    isRangeSelected(range.duration)
                      ? 'bg-gray-100 dark:bg-gray-800'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-800/50',
                  ]"
                  truncate
                  @click="selectRange(range.duration)"
                />
              </div>

              <DatePicker v-model="rangeDate" @close="close" />
            </div>
          </template>
        </UPopover>
        <!-- reload -->
        <UButton
          :loading="loading"
          icon="streamline:interface-arrows-synchronize-arrows-loading-load-sync-synchronize-arrow-reload"
          @click="fetchOrders"
        />
      </div>
      <div class="flex text-2xl gap-2">
        <span>count:</span>
        <UBadge color="green" size="md" variant="subtle">{{
          totalCount
        }}</UBadge>
      </div>
      <div class="flex text-2xl gap-2">
        <span>total:</span>
        <UBadge color="green" size="md" variant="subtle"
          >${{ totalPrice }}</UBadge
        >
      </div>
    </div>

    <UTable
      :loading="loading"
      :loading-state="{
        icon: 'i-heroicons-arrow-path-20-solid',
        label: 'Loading...',
      }"
      :progress="{ color: 'primary', animation: 'carousel' }"
      :rows="orders"
      :columns="columns"
      :ui="{
        base: 'min-w-full table-fixed max-h-fit',
        thead: 'sticky w-full top-0 bg-white dark:bg-gray-800',
        tbody: 'divide-y divide-gray-200 dark:divide-gray-800',
      }"
    >
      <template #customerName-data="{ row }">
        <ULink
          :to="`/customers/${row.id}`"
          active-class="text-primary-800"
          inactive-class="text-primary-500 dark:text-primary-400 hover:text-gray-700 dark:hover:text-gray-200"
        >
          {{ row.customer.name }}
        </ULink>
      </template>

      <template #total-data="{ row }">
        <span>${{ row.total }}</span>
      </template>

      <template #createdAt-data="{ row }">
        <span>{{ new Date(row.createdAt).toLocaleDateString() }}</span>
      </template>

      <template #actions-data="{ row }">
        <UButtonGroup>
          <UButton @click="navigateTo(`/orders/${row.id}`)"> View </UButton>
          <!-- <UButton color="blue" @click="navigateTo(`/orders/${row.id}/edit`)">
            Edit
          </UButton> -->
          <UButton
            color="red"
            @click="deleteOrder(row)"
            v-if="$user.value?.role === 'ADMIN'"
          >
            Delete
          </UButton>
        </UButtonGroup>
      </template>

      <template #empty-state>
        <div class="flex flex-col items-center justify-center py-6 gap-3">
          <span class="italic text-sm">No orders found</span>
        </div>
      </template>
    </UTable>

    <!-- Pagination -->
    <div
      class="flex justify-end px-3 py-3.5 border-t border-gray-200 dark:border-gray-700"
    >
      <UPagination v-model="page" :page-count="limit" :total="totalCount" />
    </div>
  </div>
</template>
