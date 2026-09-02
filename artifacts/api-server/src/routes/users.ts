import { Router } from "express";
import { db } from "@workspace/db";
import { usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { UpdateMeBody } from "@workspace/api-zod";

const router = Router();

router.get("/users/me", async (req, res) => {
  const clerkId = req.auth?.userId;
  if (!clerkId) return res.status(401).json({ error: "Unauthorized" });

  let user = (await db.select().from(usersTable).where(eq(usersTable.clerkId, clerkId)).limit(1))[0];
  if (!user) {
    [user] = await db.insert(usersTable).values({
      clerkId,
      name: "User",
      email: "",
      role: "user",
    }).returning();
  }

  res.json(user);
});

router.patch("/users/me", async (req, res) => {
  const clerkId = req.auth?.userId;
  if (!clerkId) return res.status(401).json({ error: "Unauthorized" });

  const body = UpdateMeBody.safeParse(req.body);
  if (!body.success) return res.status(400).json({ error: body.error });

  let user = (await db.select().from(usersTable).where(eq(usersTable.clerkId, clerkId)).limit(1))[0];
  if (!user) return res.status(404).json({ error: "User not found" });

  const [updated] = await db.update(usersTable).set(body.data).where(eq(usersTable.clerkId, clerkId)).returning();
  res.json(updated);
});

export default router;
