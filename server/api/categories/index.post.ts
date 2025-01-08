import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);

    const { name, description, parentId } = body;

    if (!name) {
      setResponseStatus(event, 400);
      return {
        error: "Name is required",
      };
    }

    // make sure the category name is unique
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

    // Check if a parent category exists (if provided)
    let parentCategory;
    if (parentId) {
      parentCategory = await prisma.category.findUnique({
        where: {
          id: parentId,
        },
      });
      

      if (!parentCategory) {
        setResponseStatus(event, 400);
        return {
          error: "Parent category not found",
        };
      }
    }

    // Create a new category
    const newCategory = await prisma.category.create({
      data: {
        name,
        description,
        parentId : parentId || null,
      },
    });

    return newCategory;
  } catch (error) {
    console.error(error);
    throw createError({ statusCode: 500, message: "Error creating category" });
  }
});
