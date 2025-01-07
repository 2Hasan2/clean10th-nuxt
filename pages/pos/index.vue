<script setup lang="ts">
import debounce from 'lodash/debounce';
definePageMeta({
  breadcrumb: {
    label: 'point of sale',
    icon: 'catppuccin:salesforce'
  },
  layout: 'pos',
});

interface Product {
  id: string;
  name: string;
  price: number;
}

interface Costumer {
  id: string;
  name: string;
}

interface CartItem extends Product {
  quantity: number;
}

interface ProductPagination {
  products: Product[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  limit: number;
}

const toast = useToast();

const productPagenation = ref<ProductPagination>({
  products: [],
  totalCount: 0,
  totalPages: 0,
  currentPage: 1,
  limit: 30,
});

const cart = ref<CartItem[]>([]);
const name = ref<string>();
const loading = ref(true);
const costumers = ref<Costumer[]>([]);
const selectedCostumers = ref<Costumer>()

const fetchProducts = async () => {
  loading.value = true;
  try {
    const response = await $fetch('/api/products', {
      params: {
        name: name.value,
        page: productPagenation.value.currentPage,
        limit: productPagenation.value.limit,
        sortBy: 'name',
        sortOrder: 'asc',
      },
    })
    productPagenation.value = response;
  } catch (error) {
    console.error('Error fetching products:', error);
  } finally {
    loading.value = false;
  }
};

const fetchCostumers = async () => {
  try {
    const response = await $fetch('/api/customers/all');
    costumers.value = response;
    selectedCostumers.value = response[0];
  } catch (error) {
    console.error('Error fetching costumers:', error);
  }
};

const totalPrice = computed(() => {
  return cart.value.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);
});

const addProductToCart = (product: Product) => {
  const existingItem = cart.value.find(item => item.id === product.id);
  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.value.push({ ...product, quantity: 1 });
  }
};

const checkout = async () => {
  if (!selectedCostumers.value) {
    toast.add({
      title: 'Please select a customer',
      timeout: 2000,
      color: "yellow"
    });
    return;
  }
  try {
    const orderData = {
      customerId: selectedCostumers.value.id,
      items: cart.value.map(item => ({
        productId: item.id,
        quantity: item.quantity,
      })),
    };

    const response = await $fetch('/api/orders', {
      method: 'POST',
      body: orderData,
    });

    if (response && 'id' in response) {
      toast.add({
        title: 'Order created successfully',
        timeout: 2000,
        color: "green"
      });
      cart.value = [];
    } else if (response && 'error' in response) {
      toast.add({
        title: response.error,
        timeout: 2000,
        color: "red"
      });
    } else {
      toast.add({
        title: 'There was an error processing your order',
        timeout: 2000,
        color: "red"
      });
    }
  } catch (error) {
    console.error('Error creating order:', error);
    toast.add({
      title: 'There was an error processing your order',
      timeout: 2000,
      color: "red"
    });
  }
};

onMounted(() => {
  fetchProducts();
  fetchCostumers();
});

watch(() => productPagenation.value.currentPage, fetchProducts);

const debouncedFetchProducts = debounce(fetchProducts, 500);

watch(name, debouncedFetchProducts);
</script>

<template>
  <div class="flex w-full h-full p-4 gap-5">
    <UCard class="w-full" :ui="{
      body: {
        base: 'flex flex-col gap-4 h-full justify-between',
      }
    }">
      <UInput :loading="loading" v-model="name" icon="i-heroicons-magnifying-glass-20-solid" size="lg" color="white"
        trailing placeholder="Search..." />
      <div class="flex flex-col h-full overflow-y-auto">
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div class="min-w-32 p-2" v-for="product in productPagenation.products" :key="product.id">
            <div class="flex flex-col gap-2 p-2 border border-gray-800 rounded">
              <div class="flex justify-between gap-2 items-center">
                <span class="text-lg whitespace-nowrap overflow-hidden text-ellipsis" title="{{ product.name }}">
                  {{ product.name }}
                </span>
                <UBadge color="emerald" variant="subtle">${{ product.price }}</UBadge>
              </div>
              <UButton @click="addProductToCart(product)">
                Add
              </UButton>
            </div>
          </div>
        </div>
      </div>
      <UPagination v-model="productPagenation.currentPage" :page-count="productPagenation.limit"
        :total="productPagenation.totalCount" />
    </UCard>
    <UCard class="w-1/3" :ui="{
      body: {
        base: 'h-full',
      }
    }">
      <div class="flex flex-col gap-4 h-full justify-between">
        <UInputMenu option-attribute="name" by="id" v-model="selectedCostumers" :options="costumers"
          placeholder="Select a customer...">
          <template #option="{ option: costumer }">
            <span class="truncate">{{ costumer.name }}</span>
          </template>
        </UInputMenu>
        <div class="flex flex-col gap-2 h-full overflow-y-auto pb-2">
          <span class="text-lg">Cart</span>
          <div class="flex flex-col gap-4">
            <div class="flex justify-between items-center border rounded border-gray-800 p-2" v-for="item in cart"
              :key="item.id">
              <span>{{ item.name }}</span>
              <span>{{ item.quantity }} x ${{ item.price }}</span>
              <!-- + / - for quantity -->
              <div class="flex flex-col gap-2">
                <div class="flex gap-2">
                  <UButton icon="lucide:diamond-minus" size="sm" color="yellow" square variant="solid"
                    @click="item.quantity--" :disabled="item.quantity === 1" />
                  <UButton icon="lucide:diamond-plus" size="sm" color="blue" square variant="solid"
                    @click="item.quantity++" />
                </div>
                <UButton block color="red" @click="cart.splice(cart.indexOf(item), 1)">
                  delete
                </UButton>
              </div>
            </div>
          </div>
        </div>
        <div class="flex flex-col gap-4">
          <div class="flex justify-between">
            <span>Total:</span>
            <span>${{ totalPrice }}</span>
          </div>
          <UButton @click="checkout" :disabled="cart.length === 0">
            Checkout
          </UButton>
        </div>
      </div>
    </UCard>
  </div>
</template>
