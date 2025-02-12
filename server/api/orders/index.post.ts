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
    const productIds = items.map((item) => item.productId);

    // Fetch all products and stock information at once
    const [products, stocks] = await prisma.$transaction([
      prisma.product.findMany({
        where: { id: { in: productIds } },
      }),
      prisma.stock.findMany({
        where: { productId: { in: productIds } },
      }),
    ]);

    // Create a map of products and stock for quick lookup
    const productMap = new Map(
      products.map((product) => [product.id, product])
    );
    const stockMap = new Map(stocks.map((stock) => [stock.productId, stock]));

    let total = 0;
    const orderItems = [];

    // Process items and check stock availability
    for (const item of items) {
      const { productId, quantity } = item;
      const product = productMap.get(productId);
      const stock = stockMap.get(productId);

      if (!product) {
        setResponseStatus(event, 404);
        return {
          error: `Product with ID ${productId} not found`,
        };
      }

      // Check if there's enough stock for the product
      if (!stock || stock.quantity < quantity) {
        setResponseStatus(event, 400);
        return {
          error: `Not enough stock for ${product.name}, ${
            stock && stock.quantity > 0
              ? `only ${stock.quantity} available`
              : "out of stock"
          }`,
        };
      }

      const itemPrice = product.price;
      total += itemPrice * quantity;

      orderItems.push({
        productId,
        quantity,
        price: itemPrice,
      });

      // Reduce stock quantity (bulk update later in transaction)
      stock.quantity -= quantity;
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

    // Update stock quantities in bulk (reduce stock in one call)
    const stockUpdates = stocks.map((stock) => ({
      where: { productId: stock.productId },
      data: { quantity: stock.quantity },
    }));

    await prisma.$transaction(
      stockUpdates.map((update) => prisma.stock.update(update))
    );

    return newOrder;
  } catch (error) {
    console.error(error);
    throw createError({ statusCode: 500, message: "Error creating order" });
  }
});
