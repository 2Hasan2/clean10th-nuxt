import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
  try {
    const id = event.context.params?.id;

    // Validate the user ID
    if (!id) {
      setResponseStatus(event, 400);
      return {
        error: "User ID is required",
      };
    }

    // Find the user to delete
    const existingUser = await prisma.users.findUnique({
      where: { id },
    });

    // If the user does not exist, return a 404 error
    if (!existingUser) {
      setResponseStatus(event, 404);
      return {
        error: "User not found",
      };
    }

    // Delete the user
    await prisma.users.delete({
      where: { id },
    });

    return { message: "User deleted successfully" };
  } catch (error) {
    throw createError({ statusCode: 500, message: "Error deleting user" });
  }
});
