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

// PRIORITY WEIGHT
const getPriorityWeight = (priority) => {
return priority === "Urgent" ? 2 : 1;
};

// VALIDATION
const allowedCategories = new Set([
"General",
"Event",
"Exam",
]);

const allowedPriorities = new Set([
"Normal",
"Urgent",
]);

function validateNotice(data) {
const errors = [];

if (!data.title || !data.title.trim()) {
errors.push("Title is required");
}

if (!data.body || !data.body.trim()) {
errors.push("Body is required");
}

if (
!data.publishDate ||
Number.isNaN(new Date(data.publishDate).getTime())
) {
errors.push("Publish date must be valid");
}

if (!allowedCategories.has(data.category)) {
errors.push(
"Category must be General, Event, or Exam"
);
}

if (!allowedPriorities.has(data.priority)) {
errors.push(
"Priority must be Normal or Urgent"
);
}

return errors;
}

export default async function handler(req, res) {
try {

// GET
if (req.method === "GET") {

  const notices = await prisma.notice.findMany({
    orderBy: [
      { priorityWeight: "desc" },
      { createdAt: "desc" },
    ],
  });

  return res.status(200).json(notices);
}

// POST
if (req.method === "POST") {

  const errors = validateNotice(req.body);

  if (errors.length > 0) {
    return res.status(400).json({
      message: errors.join(", "),
    });
  }

  const {
    title,
    body,
    category,
    priority,
    publishDate,
  } = req.body;

  const newNotice = await prisma.notice.create({
    data: {
      title,
      body,
      category,
      priority,
      priorityWeight: getPriorityWeight(priority),
      publishDate: new Date(publishDate),
    },
  });

  return res.status(201).json(newNotice);
}

// PUT
if (req.method === "PUT") {

  const errors = validateNotice(req.body);

  if (errors.length > 0) {
    return res.status(400).json({
      message: errors.join(", "),
    });
  }

  const {
    id,
    title,
    body,
    category,
    priority,
    publishDate,
  } = req.body;

  const updated = await prisma.notice.update({
    where: { id },
    data: {
      title,
      body,
      category,
      priority,
      priorityWeight: getPriorityWeight(priority),
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

  return res.status(200).json({
    message: "Deleted successfully",
  });
}

return res.status(405).json({
  message: "Method not allowed",
});


} catch (error) {


return res.status(500).json({
  error: error.message,
});


}
}
