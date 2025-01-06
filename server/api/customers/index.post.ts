import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);

    let { name, email, phone, address } = body;

    email = email || undefined;

    
    if (!name) {
      setResponseStatus(event, 400);
      return {
        error: "Name is required",
      };
    }

    // make sure name and email are unique
    const existingcustomer = await prisma.customer.findFirst({
      where: {
        OR: [
          {
            name,
          },
          {
            email,
          },
        ],
      },
    });

    if (existingcustomer) {
      setResponseStatus(event, 400);
      return {
        error: "Name or Email is already taken",
      };
    }

    const newcustomer = await prisma.customer.create({
      data: {
        name,
        email,
        phone,
        address,
      },
    });

    return newcustomer;
  } catch (error) {
    console.error(error);
    throw createError({ statusCode: 500, message: "Error creating customer" });
  }
});
