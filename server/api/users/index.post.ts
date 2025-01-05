import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);

    const { name, email } = body;

    if (!name || !email) {
      setResponseStatus(event, 400);
      return {
        error: "Name and email are required",
      };
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      setResponseStatus(event, 400);
      return {
        error: "User already exists",
      };
    }

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
      },
    });

    return newUser;
  } catch (error) {
    throw createError({ statusCode: 500, message: "Error creating user" });
  }
});
