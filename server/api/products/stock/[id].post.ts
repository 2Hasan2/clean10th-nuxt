import { isNumber } from "lodash";
import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
  try {
    const id = event.context.params?.id;

    const body = await readBody(event);

    const { quantity } = body;

    if (!id) {
      setResponseStatus(event, 400);
      return {
        error: "stock ID is required",
      };
    }

    if (quantity < 0) {
        setResponseStatus(event, 400);
        return {
            error: "Quantity must be integer"
        };
    }

    const stock = await prisma.stock.update({
        where: { id },
        data: {
            quantity,
        },
        include: {
            product: true,
        },
    });

    return stock;
  } catch (error) {
    throw createError({ statusCode: 500, message: "Error fetching stock" });
  }
});
