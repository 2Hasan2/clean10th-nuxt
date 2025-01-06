import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
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

  try {
    const products = await prisma.product.findMany({
      where,
      skip,
      take,
      orderBy: {
        [sortBy as string]: sortOrder === "asc" ? "asc" : "desc",
      },
    });

    const totalCount = await prisma.product.count({
      where,
    });

    return {
      products,
      totalCount,
      limit: take,
      totalPages: Math.ceil(totalCount / take),
      currentPage: parseInt(page as string),
    };
  } catch (error) {
    console.error(error);
    throw createError({ statusCode: 500, message: "Internal Server Error" });
  }
});
