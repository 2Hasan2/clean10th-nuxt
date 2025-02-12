import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
  try {
    const id = event.context.params?.id;

    if (!id) {
      setResponseStatus(event, 400);
      return {
        error: "category ID is required",
      };
    }

    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        products: true,
      },
    });

    if (!category) {
      setResponseStatus(event, 404);
      return {
        error: "category not found",
      };
    }

    return category;
  } catch (error) {
    throw createError({ statusCode: 500, message: "Error fetching category" });
  }
});
