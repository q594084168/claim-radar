// Prisma client - will be configured when database is set up
// For now, we'll use mock data

export const prisma = null as any;

// Uncomment and configure when DATABASE_URL is available:
// import { PrismaClient } from "@/generated/prisma/client";
//
// const globalForPrisma = globalThis as unknown as {
//   prisma: PrismaClient | undefined;
// };
//
// export const prisma =
//   globalForPrisma.prisma ??
//   new PrismaClient({
//     accelerateUrl: process.env.DATABASE_URL!,
//   });
//
// if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
