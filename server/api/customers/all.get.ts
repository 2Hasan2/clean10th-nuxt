import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
  const {
    name,
  } = getQuery(event);

  const where: any = {
    ...(name && {
      name: {
        contains: name as string,
      },
    }),
    deletedAt: null,
  };

  try {
    const customers = await prisma.customer.findMany({
      where,
    });

    return customers
  } catch (error) {
    console.error(error);
    throw createError({ statusCode: 500, message: "Internal Server Error" });
  }
});
