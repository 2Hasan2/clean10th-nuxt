import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { name, description, parentId } = body;

    const id = event.context.params?.id;

    if (!id) {
      setResponseStatus(event, 400);
      return {
        error: "Category ID is required",
      };
    }

    // Ensure that at least one field is provided for update
    if (!name && !description && parentId === undefined) {
      setResponseStatus(event, 400);
      return {
        error: "At least one field (name, description, parentId) must be provided for update",
      };
    }

    // Find the category to update
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
        description: description || existingCategory.description,
        parentId: parentId || existingCategory.parentId,
      },
    });

    return updatedCategory;
  } catch (error) {
    throw createError({ statusCode: 500, message: "Error updating category" });
  }
});
