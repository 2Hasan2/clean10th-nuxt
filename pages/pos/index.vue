<script setup lang="ts">
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

const productPagenation = ref<ProductPagination>({
  products: [],
  totalCount: 0,
  totalPages: 0,
  currentPage: 1,
  limit: 5,
});
const cart = ref<CartItem[]>([]);

const fetchProducts = async () => {
  try {
    const response = await $fetch('/api/products');
    productPagenation.value = response;
  } catch (error) {
    console.error('Error fetching products:', error);
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
  try {
    const orderData = {
      customerId: 'someCustomerId', // Replace with actual customer ID, dynamically passed
      items: cart.value.map(item => ({
        productId: item.id,
        quantity: item.quantity,
      })),
    };

    // Make the API call to create the order
    const response = await $fetch('/api/orders', {
      method: 'POST',
      body: orderData,
    });

    if (response && 'id' in response) {
      alert(`Order created successfully! Order ID: ${response.id}`);
      cart.value = [];
    } else if (response && 'error' in response) {
      alert(`Failed to create order: ${response.error}`);
    } else {
      alert('Failed to create order.');
    }
  } catch (error) {
    console.error('Error creating order:', error);
    alert('There was an error processing your order.');
  }
};

onMounted(() => {
  fetchProducts();
});
</script>

<template>
  <div class="flex flex-col max-h-screen p-4 bg-red-400">
    <!-- Main Content -->
    <main class="flex-grow p-6 flex flex-row gap-6">
      <!-- Left Side: Product Selection -->
      <div class="w-1/3 bg-gray-100 p-4 rounded-lg shadow-md">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">Products</h2>
        <div class="space-y-4">
          <!-- Product List -->
          <div v-for="product in productPagenation.products" :key="product.id" class="flex justify-between items-center">
            <span class="text-sm text-gray-700">{{ product.name }}</span>
            <button @click="addProductToCart(product)"
              class="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">
              Add to Cart
            </button>
          </div>
        </div>
      </div>

      <!-- Right Side: Cart and Total -->
      <div class="w-2/3 bg-white p-4 rounded-lg shadow-md">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">Cart</h2>
        <div class="space-y-4">
          <!-- Cart List -->
          <div v-for="item in cart" :key="item.id" class="flex justify-between items-center">
            <span class="text-sm text-gray-700">{{ item.name }} x{{ item.quantity }}</span>
            <span class="text-sm text-gray-700">${{ item.price * item.quantity }}</span>
          </div>

          <!-- Total Price -->
          <div class="mt-4 flex justify-between items-center">
            <span class="text-lg font-semibold text-gray-800">Total:</span>
            <span class="text-lg font-semibold text-gray-800">${{ totalPrice }}</span>
          </div>

          <!-- Checkout Button -->
          <button @click="checkout" class="w-full mt-6 bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700">
            Checkout
          </button>
        </div>
      </div>
    </main>
  </div>
</template>
