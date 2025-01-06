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

    const existingcustomer = await prisma.customer.findUnique({
      where: { id },
    });

    if (!existingcustomer) {
      setResponseStatus(event, 404);
      return {
        error: "customer not found",
      };
    }

    await prisma.customer.delete({
      where: { id },
    });

    return { message: "customer deleted successfully" };
  } catch (error) {
    throw createError({ statusCode: 500, message: "Error deleting customer" });
  }
});
