import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
  const {
    name,
    description,
    page = 1,
    limit = 10,
    sortOrder = "asc",
  } = getQuery(event);

  const where: any = {
    ...(name && {
      name: {
        contains: name as string,
        mode: "insensitive",
      },
    }),
    ...(description && {
      description: {
        contains: description as string,
        mode: "insensitive",
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
        stock: {
          quantity: sortOrder === "asc" ? "asc" : "desc",
        },
      },
      include: {
        stock: true,
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
