import prisma from "~/lib/prisma";
import bcrypt from "bcryptjs";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);

    const { name, email, password } = body;

    if (!name || !email || !password) {
      setResponseStatus(event, 400);
      return {
        error: "Name and email and password are required",
      };
    }

    const existingUser = await prisma.users.findUnique({
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

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.users.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return newUser;
  } catch (error) {
    throw createError({ statusCode: 500, message: "Error creating user" });
  }
});
