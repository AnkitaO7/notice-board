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

//  HELPER FUNCTIONS 

const getPriorityWeight = (priority) => {
  return priority === "Urgent" ? 2 : 1;
};

const allowedCategories = new Set(["General", "Event", "Exam"]);
const allowedPriorities = new Set(["Normal", "Urgent"]);

function isValidDate(dateStr) {
  if (!dateStr) return false;
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return false;
  const year = date.getFullYear();
  return year >= 1950 && year <= 2050;
}

function validateNotice(data) {
  const errors = [];

  if (!data.title?.trim()) errors.push("Title is required");
  if (!data.body?.trim()) errors.push("Body is required");
  if (!data.publishDate || !isValidDate(data.publishDate)) {
    errors.push("Publish date must be between 1950 and 2050");
  }
  if (!allowedCategories.has(data.category)) {
    errors.push("Category must be General, Event, or Exam");
  }
  if (!allowedPriorities.has(data.priority)) {
    errors.push("Priority must be Normal or Urgent");
  }

  return errors;
}

//  MAIN HANDLER 

export default async function handler(req, res) {
  try {
    // GET ALL NOTICES
    if (req.method === "GET") {
      const notices = await prisma.notice.findMany({
        orderBy: [
          { priorityWeight: "desc" },   // Urgent pehle
          { createdAt: "desc" },        // Recent pehle
        ],
      });
      return res.status(200).json(notices);
    }

    // CREATE NEW NOTICE
    if (req.method === "POST") {
      const errors = validateNotice(req.body);
      if (errors.length > 0) {
        return res.status(400).json({ message: errors.join(", ") });
      }

      const { title, body, category, priority, publishDate } = req.body;

      const newNotice = await prisma.notice.create({
        data: {
          title: title.trim(),
          body: body.trim(),
          category,
          priority,
          priorityWeight: getPriorityWeight(priority),
          publishDate: new Date(publishDate),
        },
      });

      return res.status(201).json(newNotice);
    }

    // UPDATE NOTICE
    if (req.method === "PUT") {
      const errors = validateNotice(req.body);
      if (errors.length > 0) {
        return res.status(400).json({ message: errors.join(", ") });
      }

      const { id, title, body, category, priority, publishDate } = req.body;

      const updated = await prisma.notice.update({
        where: { id: Number(id) },
        data: {
          title: title.trim(),
          body: body.trim(),
          category,
          priority,
          priorityWeight: getPriorityWeight(priority),
          publishDate: new Date(publishDate),
        },
      });

      return res.status(200).json(updated);
    }

    // DELETE NOTICE
    if (req.method === "DELETE") {
      const { id } = req.body;

      if (!id) {
        return res.status(400).json({ message: "ID is required" });
      }

      await prisma.notice.delete({
        where: { id: Number(id) },
      });

      return res.status(200).json({ message: "Deleted successfully" });
    }

    // Method not allowed
    return res.status(405).json({ message: "Method not allowed" });
  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}