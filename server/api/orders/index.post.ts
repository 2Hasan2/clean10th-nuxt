import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);

    let { customerId, items } = body;
    if (!customerId || !items || !Array.isArray(items) || items.length === 0) {
      setResponseStatus(event, 400);
      return {
        error: "Customer ID and items are required",
      };
    }

    // Check if the customer exists
    const customer = await prisma.customer.findUnique({
      where: {
        id: customerId,
      },
    });

    if (!customer) {
      setResponseStatus(event, 404);
      return {
        error: "Customer not found",
      };
    }

    // Collect all product IDs from items
    const productIds = items.map(item => item.productId);

    // Fetch all products at once
    const products = await prisma.product.findMany({
      where: {
        id: { in: productIds },
      },
    });

    // Create a map of products for quick lookup
    const productMap = new Map(products.map(product => [product.id, product]));

    let total = 0;
    const orderItems = [];

    // Process items
    for (const item of items) {
      const { productId, quantity } = item;
      const product = productMap.get(productId);

      if (!product) {
        setResponseStatus(event, 404);
        return {
          error: `Product with ID ${productId} not found`,
        };
      }

      const itemPrice = product.price * quantity;
      total += itemPrice;

      orderItems.push({
        productId,
        quantity,
        price: itemPrice,
      });
    }

    // Create the order with all items in a single operation
    const newOrder = await prisma.order.create({
      data: {
        customerId,
        total,
        orderItem: {
          create: orderItems,
        },
      },
      include: {
        orderItem: true,
      },
    });

    return newOrder;
  } catch (error) {
    console.error(error);
    throw createError({ statusCode: 500, message: "Error creating order" });
  }
});
