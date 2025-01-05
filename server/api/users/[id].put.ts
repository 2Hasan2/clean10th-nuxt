import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { name, email } = body;

    const id = event.context.params?.id;

    if (!id) {
      setResponseStatus(event, 400);
      return {
        error: "User ID is required",
      };
    }

    if (!id) {
      setResponseStatus(event, 400);
      return {
        error: "User ID is required",
      };
    }

    if (!name && !email) {
      setResponseStatus(event, 400);
      return {
        error: "At least one of name or email must be provided for update",
      };
    }

    const existingUser = await prisma.users.findUnique({
      where: { id },
    });

    if (!existingUser) {
      setResponseStatus(event, 404);
      return {
        error: "User not found",
      };
    }

    if (email && email !== existingUser.email) {
      const emailExists = await prisma.users.findUnique({
        where: { email },
      });
      if (emailExists) {
        setResponseStatus(event, 400);
        return {
          error: "Email is already in use",
        };
      }
    }

    const updatedUser = await prisma.users.update({
      where: { id },
      data: {
        name: name || existingUser.name,
        email: email || existingUser.email,
      },
    });

    return updatedUser;
  } catch (error) {
    throw createError({ statusCode: 500, message: "Error updating user" });
  }
});
