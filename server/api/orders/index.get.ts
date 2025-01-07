import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
  try {
    const {
      customerName,
      minTotal,
      maxTotal,
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "desc",
      startDate,
      endDate,
    } = getQuery(event);
    

    const where: any = {
      ...(customerName && {
        customer: {
          name: {
            contains: customerName as string,
            mode: "insensitive",
          },
        },
      }),
      ...(minTotal && {
        total: {
          gte: parseFloat(minTotal as string),
        },
      }),
      ...(maxTotal && {
        total: {
          lte: parseFloat(maxTotal as string),
        },
      }),
      ...(startDate && endDate && {
          createdAt: {
            gte: startDate,
            lte: endDate
          },
        }),
        deletedAt: null,
    };

    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
    const take = parseInt(limit as string);

    const orders = await prisma.order.findMany({
      where,
      skip,
      take,
      orderBy: {
        [sortBy as string]: sortOrder === "asc" ? "asc" : "desc",
      },
      include: {
        customer: true,
        orderItem: {
          include: {
            product: true,
          },
        },
      },
    });

    const aggregation = await prisma.order.aggregate({
      where,
      _sum: {
        total: true,
      },
      _count: true,
    });

    const totalCount = aggregation._count;
    const totalPrice = aggregation._sum.total || 0;

    return {
      orders,
      totalCount,
      totalPrice,
      limit: take,
      totalPages: Math.ceil(totalCount / take),
      currentPage: parseInt(page as string),
    };
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw createError({ statusCode: 500, message: "Error fetching orders" });
  }
});
