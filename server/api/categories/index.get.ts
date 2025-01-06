import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
  try {
    const {
      name,
      description,
      page = 1,
      limit = 10,
      sortBy = "name",
      sortOrder = "asc",
    } = getQuery(event);

    const where: any = {
      ...(name && {
        name: {
          contains: name as string,
        },
      }),
      ...(description && {
        description: {
          contains: description as string,
        },
      }),
    };

    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
    const take = parseInt(limit as string);

    // Fetch categories with pagination and optional filters
    const categories = await prisma.category.findMany({
      where,
      skip,
      take,
      orderBy: {
        [sortBy as string]: sortOrder === "asc" ? "asc" : "desc",
      },
      include: {
        children: true, // Include children categories
      },
    });

    const totalCount = await prisma.category.count({
      where,
    });

    return {
      categories,
      totalCount,
      limit: take,
      totalPages: Math.ceil(totalCount / take),
      currentPage: parseInt(page as string),
    };
  } catch (error) {
    console.error(error);
    throw createError({ statusCode: 500, message: "Error fetching categories" });
  }
});
