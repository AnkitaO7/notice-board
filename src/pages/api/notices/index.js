// import { PrismaClient } from "@/generated/prisma/client";
// import { PrismaPg } from "@prisma/adapter-pg";

// const globalForPrisma = globalThis;

// const adapter = new PrismaPg({
//   connectionString: process.env.DATABASE_URL,
// });

// const prisma =
//   globalForPrisma.prisma ??
//   new PrismaClient({
//     adapter,
//   });

// if (process.env.NODE_ENV !== "production") {
//   globalForPrisma.prisma = prisma;
// }

// export default async function handler(req, res) {
//   try {
//     if (req.method === "GET") {
//       const notices = await prisma.notice.findMany({
//         orderBy: { createdAt: "desc" },
//       });
//       return res.status(200).json(notices);
//     }

//     return res.status(405).json({ message: "Method not allowed" });
//   } catch (error) {
//     return res.status(500).json({ error: error.message });
//   }
// }

import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis;

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default async function handler(req, res) {
  try {
    // GET ALL
    if (req.method === "GET") {
      const notices = await prisma.notice.findMany({
        orderBy: { createdAt: "desc" },
      });
      return res.status(200).json(notices);
    }

    // CREATE
    if (req.method === "POST") {
      const { title, body, category, priority, publishDate } = req.body;

      const notice = await prisma.notice.create({
        data: {
          title,
          body,
          category,
          priority,
          publishDate: new Date(publishDate),
        },
      });

      return res.status(201).json(notice);
    }

    // UPDATE
    if (req.method === "PUT") {
      const { id, title, body, category, priority, publishDate } = req.body;

      const updated = await prisma.notice.update({
        where: { id },
        data: {
          title,
          body,
          category,
          priority,
          publishDate: new Date(publishDate),
        },
      });

      return res.status(200).json(updated);
    }

    // DELETE
    if (req.method === "DELETE") {
      const { id } = req.body;

      await prisma.notice.delete({
        where: { id },
      });

      return res.status(200).json({ message: "Deleted successfully" });
    }

    return res.status(405).json({ message: "Method not allowed" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}