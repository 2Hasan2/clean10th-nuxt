import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
  const {
    name,
    email,
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
    ...(email && {
      email: {
        contains: email as string,
        mode: "insensitive",
      },
    }),
  };

  const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
  const take = parseInt(limit as string);

  try {
    const users = await prisma.users.findMany({
      where,
      skip,
      take,
      orderBy: {
        [sortBy as string]: sortOrder === "asc" ? "asc" : "desc",
      },
    });

    const totalCount = await prisma.users.count({
      where,
    });

    return {
      users,
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
