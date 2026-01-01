import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";

function prismaClientSingleton() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not defined");
  }

  // Use accelerateUrl as per docs
  return new PrismaClient({
    accelerateUrl: process.env.DATABASE_URL,
  }).$extends(withAccelerate());
}

const globalForPrisma = global as unknown as {
  prisma: ReturnType<typeof prismaClientSingleton> | undefined;
};

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}