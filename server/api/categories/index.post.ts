import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);

    const { name } = body;

    if (!name) {
      setResponseStatus(event, 400);
      return {
        error: "Name is required",
      };
    }

    const existingCategory = await prisma.category.findFirst({
      where: {
        name,
      },
    });

    if (existingCategory) {
      setResponseStatus(event, 400);
      return {
        error: "Category name already exists",
      };
    }

    const newCategory = await prisma.category.create({
      data: {
        name,
      },
    });

    return newCategory;
  } catch (error) {
    console.error(error);
    throw createError({ statusCode: 500, message: "Error creating category" });
  }
});
