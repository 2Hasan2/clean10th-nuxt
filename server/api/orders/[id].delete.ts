import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
  try {
    const id = event.context.params?.id;

    if (!id) {
      setResponseStatus(event, 400);
      return {
        error: "order ID is required",
      };
    }

    const existingOrder = await prisma.order.findUnique({
      where: { id },
    });

    if (!existingOrder) {
      setResponseStatus(event, 404);
      return {
        error: "order not found",
      };
    }

    // soft delete
    await prisma.order.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });

    return { message: "order deleted successfully" };
  } catch (error) {
    throw createError({ statusCode: 500, message: "Error deleting order" });
  }
});
