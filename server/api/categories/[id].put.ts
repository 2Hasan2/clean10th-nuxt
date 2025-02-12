import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { name } = body;

    const id = event.context.params?.id;

    if (!id) {
      setResponseStatus(event, 400);
      return {
        error: "Category ID is required",
      };
    }

    const existingCategory = await prisma.category.findUnique({
      where: { id },
    });

    if (!existingCategory) {
      setResponseStatus(event, 404);
      return {
        error: "Category not found",
      };
    }

    const updatedCategory = await prisma.category.update({
      where: { id },
      data: {
        name: name || existingCategory.name,
      },
    });

    return updatedCategory;
  } catch (error) {
    throw createError({ statusCode: 500, message: "Error updating category" });
  }
});
