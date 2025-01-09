import prisma from "~/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);

    const { email, password } = body;

    if (!email || !password) {
      setResponseStatus(event, 400);
      return {
        error: "Email and password are required",
      };
    }

    const user = await prisma.users.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      setResponseStatus(event, 401);
      return {
        error: "Invalid credentials",
      };
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      setResponseStatus(event, 401);
      return {
        error: "Invalid credentials",
      };
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "7d",
    });

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    };
  } catch (error) {
    throw createError({ statusCode: 500, message: "Error logging in" });
  }
});
