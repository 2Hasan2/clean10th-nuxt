import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
  try {
    const id = event.context.params?.id;

    if (!id) {
      setResponseStatus(event, 400);
      return {
        error: "Product ID is required",
      };
    }

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });

    if (!product) {
      setResponseStatus(event, 404);
      return {
        error: "product not found",
      };
    }

    return product;
  } catch (error) {
    throw createError({ statusCode: 500, message: "Error fetching product" });
  }
});
