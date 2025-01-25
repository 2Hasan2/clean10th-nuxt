import prisma from "~/lib/prisma";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

export default defineEventHandler(async (event) => {
  try {
    const token = getHeader(event, "authorization")?.split(" ")[1];

    if (!token) {
      setResponseStatus(event, 401);
      return { error: "Unauthorized" };
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };

    const user = await prisma.users.findUnique({
      where: {
        id: decoded.id,
      },
    });

    if (!user) {
      setResponseStatus(event, 404);
      return { error: "User not found" };
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  } catch (error) {
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }
});
