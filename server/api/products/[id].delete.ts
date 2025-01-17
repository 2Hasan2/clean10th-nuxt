import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
  try {
    const id = event.context.params?.id;

    // Validate the product ID
    if (!id) {
      setResponseStatus(event, 400);
      return {
        error: "Product ID is required",
      };
    }

    // Find the product to delete
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    // If the product does not exist, return a 404 error
    if (!existingProduct) {
      setResponseStatus(event, 404);
      return {
        error: "Product not found",
      };
    }

    // Delete the product
    await prisma.product.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        stock: {
          update: {
            quantity: 0,
          },
        },
      },
    });

    return { message: "Product deleted successfully" };
  } catch (error) {
    throw createError({ statusCode: 500, message: "Error deleting product" });
  }
});
