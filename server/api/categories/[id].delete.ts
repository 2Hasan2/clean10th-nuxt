import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
  try {
    const id = event.context.params?.id;

    // Validate the category ID
    if (!id) {
      setResponseStatus(event, 400);
      return {
        error: "Category ID is required",
      };
    }

    // Find the category to delete
    const existingCategory = await prisma.category.findUnique({
      where: { id },
    });

    // If the category does not exist, return a 404 error
    if (!existingCategory) {
      setResponseStatus(event, 404);
      return {
        error: "Category not found",
      };
    }

    // Check if the category has any products associated with it
    const associatedProducts = await prisma.product.count({
      where: { categoryId: id },
    });

    if (associatedProducts > 0) {
      setResponseStatus(event, 400);
      return {
        error: "Category has products and cannot be deleted",
      };
    }

    // Delete the category
    await prisma.category.delete({
      where: { id },
    });

    return { message: "Category deleted successfully" };
  } catch (error) {
    throw createError({ statusCode: 500, message: "Error deleting category" });
  }
});
