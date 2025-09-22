import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Filtering with multiple conditions
  const activeUsers = await prisma.user.findMany({
    where: {
      age: { gte: 25 },
      email: { contains: "gmail" },
      status: "ACTIVE"
    },
    orderBy: [
      { age: "desc" },
      { name: "asc" }
    ],
    take: 5
  });

  console.log("Filtered & Sorted Users:", activeUsers);

  // 2. Filtering with OR conditions
  const specificUsers = await prisma.user.findMany({
    where: {
      OR: [
        { age: { lt: 30 } },
        { name: { startsWith: "K" } }
      ],
      NOT: {
        email: { endsWith: "test.com" }
      }
    },
    select: {
      id: true,
      name: true,
      email: true,
      age: true
    }
  });

  console.log("🔍 Complex Filter Results:", specificUsers);

  // TRANSACTION
  // Order processing with inventory update
  async function processOrder(userId: string, productId: string, quantity: number) {
    try {
      const result = await prisma.$transaction(async (tx) => {
        
        const product = await tx.product.findUnique({
          where: { id: productId },
          select: { price: true, stock: true }
        });

        if (!product || product.stock < quantity) {
          throw new Error("Insufficient stock");
        }

        const totalAmount = product.price * quantity;

        
        const order = await tx.order.create({
          data: {userId, totalAmount, status: "PROCESSING",
            items: {
              create: {
                productId,
                quantity,
                unitPrice: product.price
              }
            }
          }
        });

        await tx.product.update({
          where: { id: productId },
          data: { stock: { decrement: quantity } }
        });


        await tx.user.update({
          where: { id: userId },
          data: { totalOrders: { increment: 1 } }
        });

        return order;
      });

      console.log("✅ Transaction completed successfully:", result);
      return result;
      
    } catch (error: any) {
      console.error("❌ Transaction failed:", error.message);
      throw error;
    }
  }

  // 🚀 USING THE TRANSACTION FUNCTION
  // Simulate order processing (commented out for safety)
  // await processOrder("user-123", "product-456", 2);

  // 3. Advanced query with relations and aggregation
  const userStats = await prisma.user.findMany({
    where: {
      age: { gt: 20 } // Age greater than 20
    },
    include: {
      orders: {
        orderBy: { createdAt: "desc" },
        take: 3 // Get latest 3 orders
      },
      _count: {
        select: {
          orders: true // Include count of orders
        }
      }
    },
    orderBy: {
      orders: {
        _count: "desc" // Sort by number of orders
      }
    }
  });

  console.log("📈 User Statistics with Orders:", userStats);
}

main()
  .catch(e => {
    console.error("Error:", e.message);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });