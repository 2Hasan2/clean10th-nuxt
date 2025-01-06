import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { name, description, price, image, categoryId } = body;

    const id = event.context.params?.id;

    if (!id) {
      setResponseStatus(event, 400);
      return {
        error: "Product ID is required",
      };
    }

    // Ensure that at least one field is provided for update
    if (!name && !description && !price && !image && !categoryId) {
      setResponseStatus(event, 400);
      return {
        error: "At least one field (name, description, price, image, categoryId) must be provided for update",
      };
    }

    // Find the product to update
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      setResponseStatus(event, 404);
      return {
        error: "Product not found",
      };
    }

    // Update the product
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name: name || existingProduct.name,
        description: description || existingProduct.description,
        price: price || existingProduct.price,
        image: image || existingProduct.image,
        categoryId: categoryId || existingProduct.categoryId,
      },
    });

    return updatedProduct;
  } catch (error) {
    throw createError({ statusCode: 500, message: "Error updating product" });
  }
});
