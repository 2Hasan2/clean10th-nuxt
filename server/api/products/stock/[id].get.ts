import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
  try {
    const id = event.context.params?.id;

    if (!id) {
      setResponseStatus(event, 400);
      return {
        error: "stock ID is required",
      };
    }

    const stock = await prisma.stock.findUnique({
      where: { id },
      include: {
        product: true,
      },
    });

    if (!stock) {
      setResponseStatus(event, 404);
      return {
        error: "stock not found",
      };
    }

    return stock;
  } catch (error) {
    throw createError({ statusCode: 500, message: "Error fetching stock" });
  }
});
