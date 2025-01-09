<script setup lang="ts">
definePageMeta({
    breadcrumb: {
        label: 'view',
        icon: 'catppuccin:folder-admin'
    },
    requiresAuth: true,
    middleware: ['role'],
    role: ['ACCOUNTANT', 'CASHIER'],
});


import { useRoute, useRouter } from 'vue-router';
import type { Order, orderItem, Product, Customer } from '@prisma/client';
import { printReceipt } from '~/utils/receipt';

const route = useRoute();
const router = useRouter();
const toast = useToast();
const loading = ref(true);
const order = ref<Partial<Order & { orderItem: (orderItem & { product: Product })[], customer: Customer }>>({});

async function fetchOrder() {
    const orderId = route.params.id;
    loading.value = true;
    try {
        const response = await $fetch(`/api/orders/${orderId}`);
        if ('error' in response) {
            toast.add({
                title: 'Error fetching order',
                description: response.error,
                color: 'red',
            });
            return;
        }
        order.value = {
            ...response,
            createdAt: new Date(response.createdAt),
            updatedAt: new Date(response.updatedAt),
            deletedAt: response.deletedAt ? new Date(response.deletedAt) : null,
            customer: {
                ...response.customer,
                createdAt: new Date(response.customer.createdAt),
                updatedAt: new Date(response.customer.updatedAt),
                deletedAt: response.customer.deletedAt ? new Date(response.customer.deletedAt) : null,
            },
            orderItem: response.orderItem.map((item: any) => ({
                ...item,
                createdAt: new Date(item.createdAt),
                updatedAt: new Date(item.updatedAt),
                product: {
                    ...item.product,
                    createdAt: new Date(item.product.createdAt),
                    updatedAt: new Date(item.product.updatedAt),
                },
            })),
        };
    } catch (error) {
        toast.add({
            title: 'Error fetching order',
            description: error.message,
            color: 'red',
        });
    } finally {
        loading.value = false;
    }
}

async function deleteOrder(id: string) {
    loading.value = true;
    try {
        const response = await $fetch(`/api/orders/${id}`, {
            method: 'DELETE',
        });
        if ('error' in response) {
            toast.add({
                title: 'Error deleting order',
                description: response.error,
                color: 'red',
            });
            return;
        }
        toast.add({
            title: 'Order deleted',
            description: 'Order has been deleted successfully',
            color: 'green',
        });
        router.push('/orders');
    } catch (error) {
        toast.add({
            title: 'Error deleting order',
            description: error.message,
            color: 'red',
        });
    } finally {
        loading.value = false;
    }
}

onMounted(() => {
    fetchOrder();
});
</script>

<template>
    <div class="flex flex-col gap-5" v-if="order">
        <UCard :ui="{ padding: 'p-4', background: 'bg-white dark:bg-gray-800', }">
            <div class="flex flex-col gap-4">
                <div class="flex justify-between items-center">
                    <div class="flex flex-col space-y-2">
                        <div class="flex gap-4 items-center">
                            <h1 class="text-2xl font-bold">
                                <ULink active-class="text-primary-800"
                                    inactive-class="text-primary-500 dark:text-primary-400 hover:text-gray-700 dark:hover:text-gray-200"
                                    :to="`/customers/${order?.customer?.id}`">
                                    {{ order?.customer?.name }}
                                </ULink>
                            </h1>
                            <span class="text-sm text-gray-600">
                                order: {{ order?.id }}
                            </span>
                        </div>
                    </div>
                    <div class="flex items-center">
                        <span class="text-sm text-gray-600">
                            {{ order?.customer?.phone || 'No phone' }}
                        </span>
                    </div>
                    <div class="flex items center">
                        <span class="text-lg">
                            Total: {{ order?.total }}
                        </span>
                    </div>
                    <div class="flex items-center gap-2">
                        <UButton
                            @click="printReceipt({ cart: order.orderItem?.map(item => ({ id: item.id, name: item.product.name, product: item.product, quantity: item.quantity, price: item.price })) || [], customer: { name: order.customer?.name || 'Unknown' }, totalPrice: order.total || 0 })"
                            color="blue">
                            Print
                        </UButton>
                        <UButton @click="deleteOrder(order.id!)" color="red" v-if="$user.role === 'ADMIN'">
                            Delete
                        </UButton>
                    </div>
                </div>

                <div class="flex flex-col gap-2">
                    <div class="flex items-center space-x-2">
                        <UIcon name="fluent-emoji-flat:eight-oclock" class="w-5 h-5 text-gray-400" />
                        <span class="text-gray-400">
                            Created At: {{ order.createdAt }}
                        </span>
                    </div>
                    <div class="flex items-center space-x-2">
                        <UIcon name="fluent-emoji-flat:ten-oclock" class="w-5 h-5 text-gray-400" />
                        <span class="text-gray-400">
                            Updated At: {{ order.updatedAt }}
                        </span>
                    </div>
                </div>
            </div>
        </UCard>
        <UCard :ui="{ padding: 'p-4', background: 'bg-white dark:bg-gray-800', }">
            <div class="flex flex-col gap-4">
                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    <div class="min-w-32 p-1" v-for="item in order.orderItem" :key="item.id">
                        <UCard :ui="{ padding: 'p-4', background: 'bg-white dark:bg-gray-700', }">
                            <div class="flex flex-col gap-4">
                                <div class="flex flex-col justify-between items-center">
                                    <div class="flex flex-col space-y-2">
                                        <div class="flex gap-4 items-center">
                                            <h1 class="text-md font-bold">
                                                <ULink active-class="text-primary-800"
                                                    inactive-class="text-primary-500 dark:text-primary-400 hover:text-gray-700 dark:hover:text-gray-200"
                                                    :to="`warehouse/products/${item.product.id}`">
                                                    {{ item.product.name }}
                                                </ULink>
                                            </h1>
                                        </div>
                                    </div>
                                    <div class="flex items center">
                                        <span class="text-md">
                                            ${{ item.price }} x {{ item.quantity }} = ${{ item.price * item.quantity }}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </UCard>
                    </div>
                </div>
            </div>
        </UCard>

    </div>
    <div v-else>
        <UCard :ui="{ padding: 'p-4', background: 'bg-white dark:bg-gray-700', }">
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