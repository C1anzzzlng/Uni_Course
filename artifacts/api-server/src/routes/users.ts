import { Router } from "express";
import { getAuth } from "@clerk/express";
import { db } from "@workspace/db";
import { usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { UpdateMeBody } from "@workspace/api-zod";

const router = Router();

router.get("/users/me", async (req, res) => {
  const auth = getAuth(req);
  const clerkId = auth.userId;
  if (!clerkId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

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
  const auth = getAuth(req);
  const clerkId = auth.userId;
  if (!clerkId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const body = UpdateMeBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error });
    return;
  }

  let user = (await db.select().from(usersTable).where(eq(usersTable.clerkId, clerkId)).limit(1))[0];
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  const [updated] = await db.update(usersTable).set(body.data).where(eq(usersTable.clerkId, clerkId)).returning();
  res.json(updated);
});

export default router;
