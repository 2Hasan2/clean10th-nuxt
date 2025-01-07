import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  // Seed Categories
  const categories = [];
  for (let i = 0; i < 7; i++) {
    const category = await prisma.category.create({
      data: {
        name: faker.commerce.department(),
        description: faker.commerce.productDescription(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    categories.push(category);
  }

  console.log('Seeded 7 categories');

  // Seed Products
  const products = [];
  for (let i = 0; i < 40; i++) {
    const product = await prisma.product.create({
      data: {
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: parseFloat(faker.commerce.price()),
        image: faker.image.url(),
        category: {
          connect: { id: faker.helpers.arrayElement(categories).id },
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    products.push(product);
  }

  console.log('Seeded 40 products');

  // Seed Customers
  const customers = [];
  for (let i = 0; i < 10; i++) {
    const customer = await prisma.customer.create({
      data: {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        phone: faker.phone.number(),
        address: faker.location.streetAddress(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    customers.push(customer);
  }

  console.log('Seeded 10 customers');

  // Seed Orders and Order Items
  for (let i = 0; i < 10; i++) {
    const order = await prisma.order.create({
      data: {
        customer: {
          connect: { id: faker.helpers.arrayElement(customers).id },
        },
        total: 0, // Will calculate total below
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    let total = 0;

    for (let j = 0; j < faker.number.int({ min: 1, max: 5 }); j++) {
      const product = faker.helpers.arrayElement(products);

      const quantity = faker.number.int({ min: 1, max: 10 });
      const price = product.price * quantity;

      total += price;

      await prisma.orderItem.create({
        data: {
          order: {
            connect: { id: order.id },
          },
          product: {
            connect: { id: product.id },
          },
          quantity: quantity,
          price: product.price,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
    }

    // Update the order's total
    await prisma.order.update({
      where: { id: order.id },
      data: { total },
    });
  }

  console.log('Seeded 10 orders with order items');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
