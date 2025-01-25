import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
  const {
    name,
    page = 1,
    limit = 10,
    sortBy = "name",
    sortOrder = "asc",
  } = getQuery(event);

  const where: any = {
    ...(name && {
      name: {
        contains: name as string,
        mode: "insensitive",
      },
    }),
    deletedAt: null,
  };

  const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
  const take = parseInt(limit as string);

  try {
    const customers = await prisma.customer.findMany({
      where,
      skip,
      take,
      orderBy: {
        [sortBy as string]: sortOrder === "asc" ? "asc" : "desc",
      },
    });

    const totalCount = await prisma.customer.count({
      where,
    });

    return {
      customers,
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
