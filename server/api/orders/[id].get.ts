import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
  try {
    const id = event.context.params?.id;

    if (!id) {
      setResponseStatus(event, 400);
      return {
        error: "Order ID is required",
      };
    }

    const order = await prisma.order.findUnique({
      where: {
        id,
        deletedAt: null
       },
      include: {
        customer: true,
        orderItem: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) {
      setResponseStatus(event, 404);
      return {
        error: "Order not found",
      };
    }

    return order;
  } catch (error) {
    console.error("Error fetching order:", error);
    throw createError({ statusCode: 500, message: "Error fetching order" });
  }
});
