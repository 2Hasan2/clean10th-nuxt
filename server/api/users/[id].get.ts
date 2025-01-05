import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
  try {
    const id = parseInt(event.context.params?.id as string, 10);

    // Validate the user ID
    if (!id) {
      setResponseStatus(event, 400);
      return {
        error: "User ID is required",
      };
    }

    // Fetch the user from the database
    const user = await prisma.user.findUnique({
      where: { id },
    });

    // If the user is not found, return a 404 error
    if (!user) {
      setResponseStatus(event, 404);
      return {
        error: "User not found",
      };
    }

    return user;
  } catch (error) {
    throw createError({ statusCode: 500, message: "Error fetching user" });
  }
});
