import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { name, email } = body;

    const id = parseInt(event.context.params?.id as string, 10);

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

    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      setResponseStatus(event, 404);
      return {
        error: "User not found",
      };
    }

    if (email && email !== existingUser.email) {
      const emailExists = await prisma.user.findUnique({
        where: { email },
      });
      if (emailExists) {
        setResponseStatus(event, 400);
        return {
          error: "Email is already in use",
        };
      }
    }

    const updatedUser = await prisma.user.update({
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
