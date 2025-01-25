import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
  try {
    const id = event.context.params?.id;

    if (!id) {
      setResponseStatus(event, 400);
      return {
        error: "customer ID is required",
      };
    }

    const customer = await prisma.customer.findUnique({
      where: { id , deletedAt: null},
    });

    if (!customer) {
      setResponseStatus(event, 404);
      return {
        error: "customer not found",
      };
    }

    return customer;
  } catch (error) {
    throw createError({ statusCode: 500, message: "Error fetching customer" });
  }
});
