import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { name, email, phone, address } = body;


    const id = event.context.params?.id;

    if (!id) {
      setResponseStatus(event, 400);
      return {
        error: "customer ID is required",
      };
    }

    if (!name){
      setResponseStatus(event, 400);
      return {
        error: "Name is required",
      };
    }

    // Find the customer to update
    const existingcustomer = await prisma.customer.findUnique({
      where: { id },
    });

    if (!existingcustomer) {
      setResponseStatus(event, 404);
      return {
        error: "customer not found",
      };
    }

    // Update the customer
    const updatedcustomer = await prisma.customer.update({
      where: { id },
      data: {
        name: name || existingcustomer.name,
        email: email || existingcustomer.email,
        phone: phone || existingcustomer.phone,
        address: address || existingcustomer.address,
      },
    });

    return updatedcustomer;
  } catch (error) {
    throw createError({ statusCode: 500, message: "Error updating customer" });
  }
});
