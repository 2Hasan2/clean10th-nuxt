import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);

    const { name, description, price, image, categoryId } = body;

    if (!name || !price || !categoryId) {
      setResponseStatus(event, 400);
      return {
        error: "Name, price, and categoryId are required",
      };
    }

    // Check if the category exists
    const existingCategory = await prisma.category.findUnique({
      where: {
        id: categoryId,
      },
    });

    if (!existingCategory) {
      setResponseStatus(event, 400);
      return {
        error: "Category not found",
      };
    }

    // Check if the name is already in use
    const existingProduct = await prisma.product.findFirst({
      where: {
        name,
      },
    });

    if (existingProduct) {
      setResponseStatus(event, 400);
      return {
        error: "Product name is already in use",
      };
    }

    // Create a new product
    const newProduct = await prisma.product.create({
      data: {
        name,
        description,
        price,
        image,
        categoryId,
      },
    });

    return newProduct;
  } catch (error) {
    console.error(error);
    throw createError({ statusCode: 500, message: "Error creating product" });
  }
});
