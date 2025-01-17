import { PrismaClient, Role } from '@prisma/client';
import { faker } from '@faker-js/faker';
import { hash } from "bcryptjs";


const prisma = new PrismaClient();

async function seed() {
  // const categoryNames = new Set<string>();
  // const categories = await Promise.all(
  //   Array.from({ length: 7 }).map(() => {
  //     let name = faker.commerce.department();
      
  //     while (categoryNames.has(name)) {
  //       name = faker.commerce.department();
  //     }
      
  //     categoryNames.add(name);

  //     return prisma.category.create({
  //       data: {
  //         name,
  //         description: faker.commerce.productDescription(),
  //       },
  //     });
  //   })
  // );

  // const productNames = new Set<string>();
  // const products = await Promise.all(
  //   Array.from({ length: 50 }).map(() => {
  //     let name = faker.commerce.productName();
      
  //     while (productNames.has(name)) {
  //       name = faker.commerce.productName();
  //     }
      
  //     productNames.add(name);

  //     return prisma.product.create({
  //       data: {
  //         name,
  //         description: faker.commerce.productDescription(),
  //         price: parseFloat(faker.commerce.price()),
  //         image: faker.image.url(),
  //         categoryId: categories[Math.floor(Math.random() * categories.length)].id,
  //         upc: faker.commerce.isbn(),
  //         stock:{
  //           create: {
  //             quantity: faker.number.int({ min: 0, max: 999_999 }),
  //           },
  //         }
  //       },
  //     });
  //   })
  // );

  // Create customers
  // const customerNames = new Set<string>();
  // const customers = await Promise.all(
  //   Array.from({ length: 20 }).map(() => {
  //     let name = faker.person.fullName();
      
  //     // Ensure the name is unique
  //     while (customerNames.has(name)) {
  //       name = faker.person.fullName();
  //     }
      
  //     customerNames.add(name);

  //     return prisma.customer.create({
  //       data: {
  //         name,
  //         email: faker.internet.email(),
  //         phone: faker.phone.number(),
  //         address: faker.location.streetAddress(),
  //       },
  //     });
  //   })
  // );

  // Create orders
  // const orders = await Promise.all(
  //   Array.from({ length: 100 }).map(() =>
  //     prisma.order.create({
  //       data: {
  //         customerId: customers[Math.floor(Math.random() * customers.length)].id,
  //         total: parseFloat(faker.commerce.price()),
  //       },
  //     })
  //   )
  // );

  // // Create order items (each order will have 1 to 9 items)
  // for (const order of orders) {
  //   const numberOfItems = Math.floor(Math.random() * 9) + 1;
  //   const orderItems = await Promise.all(
  //     Array.from({ length: numberOfItems }).map(() =>
  //       prisma.orderItem.create({
  //         data: {
  //           orderId: order.id,
  //           productId: products[Math.floor(Math.random() * products.length)].id,
  //           quantity: Math.floor(Math.random() * 5) + 1, // Random quantity from 1 to 5
  //           price: parseFloat(faker.commerce.price()),
  //         },
  //       })
  //     )
  //   );
  // }

  // seed the user
  // const userNames = new Set<string>();

  // const users = await Promise.all(
  //   Array.from({ length: 10 }).map(() => {
  //     let name = faker.person.fullName();
      
  //     // Ensure the name is unique
  //     while (userNames.has(name)) {
  //       name = faker.person.fullName();
  //     }
      
  //     userNames.add(name);

  //     return prisma.users.create({
  //       data: {
  //         name,
  //         email: faker.internet.email(),
  //         password: faker.internet.password(),
  //         role: faker.helpers.arrayElement(['CASHIER', 'ACCOUNTANT']),
  //       },
  //     });
  //   })
  // );

  // create user
  const user: { name: string; email: string; password: string; role: Role } = {
    name: 'Hasan Ragab',
    email: 'hr145310@gmail.com',
    password: await hash('hasan2003', 10),
    role: 'ADMIN',
  }

  await prisma.users.create({
    data: user,
  });

  console.log('Seeding completed.');
}

seed()
  .catch(e => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
