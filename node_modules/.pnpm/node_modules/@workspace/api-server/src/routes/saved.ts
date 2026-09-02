import { Router } from "express";
import { getAuth } from "@clerk/express";
import { db } from "@workspace/db";
import { savedSchoolsTable, savedProgramsTable, schoolsTable, programsTable, usersTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { SaveSchoolBody, SaveProgramBody, UnsaveSchoolParams, UnsaveProgramParams } from "@workspace/api-zod";

const router = Router();

async function requireUser(req: any, res: any): Promise<{ id: number; clerkId: string } | null> {
  const auth = getAuth(req);
  const clerkId = auth?.sessionClaims?.userId || auth?.userId;
  if (!clerkId) {
    res.status(401).json({ error: "Unauthorized" });
    return null;
  }
  const found = await db.select().from(usersTable).where(eq(usersTable.clerkId, clerkId)).limit(1);
  if (found.length > 0) return found[0];

  const [user] = await db.insert(usersTable).values({
    clerkId,
    name: "User",
    email: "",
    role: "user",
  }).returning();
  return user;
}

router.get("/saved/schools", async (req, res) => {
  const user = await requireUser(req, res);
  if (!user) return;

  const saved = await db
    .select({ school: schoolsTable })
    .from(savedSchoolsTable)
    .leftJoin(schoolsTable, eq(savedSchoolsTable.schoolId, schoolsTable.id))
    .where(eq(savedSchoolsTable.userId, user.id));

  res.json(saved.filter(s => s.school).map(s => ({ ...s.school!, isSaved: true })));
});

router.post("/saved/schools", async (req, res) => {
  const user = await requireUser(req, res);
  if (!user) return;

  const body = SaveSchoolBody.safeParse(req.body);
  if (!body.success) return res.status(400).json({ error: body.error });

  try {
    await db.insert(savedSchoolsTable).values({ userId: user.id, schoolId: body.data.schoolId });
  } catch {
    // already saved, ignore duplicate
  }
  res.status(201).json({ ok: true });
});

router.delete("/saved/schools/:schoolId", async (req, res) => {
  const user = await requireUser(req, res);
  if (!user) return;

  const params = UnsaveSchoolParams.safeParse({ schoolId: parseInt(req.params.schoolId) });
  if (!params.success) return res.status(400).json({ error: "Invalid id" });

  await db.delete(savedSchoolsTable).where(
    and(eq(savedSchoolsTable.userId, user.id), eq(savedSchoolsTable.schoolId, params.data.schoolId))
  );
  res.status(204).send();
});

router.get("/saved/programs", async (req, res) => {
  const user = await requireUser(req, res);
  if (!user) return;

  const saved = await db
    .select({ program: programsTable, schoolName: schoolsTable.name })
    .from(savedProgramsTable)
    .leftJoin(programsTable, eq(savedProgramsTable.programId, programsTable.id))
    .leftJoin(schoolsTable, eq(programsTable.schoolId, schoolsTable.id))
    .where(eq(savedProgramsTable.userId, user.id));

  res.json(saved.filter(s => s.program).map(s => ({ ...s.program!, schoolName: s.schoolName || "", isSaved: true })));
});

router.post("/saved/programs", async (req, res) => {
  const user = await requireUser(req, res);
  if (!user) return;

  const body = SaveProgramBody.safeParse(req.body);
  if (!body.success) return res.status(400).json({ error: body.error });

  try {
    await db.insert(savedProgramsTable).values({ userId: user.id, programId: body.data.programId });
  } catch {
    // already saved, ignore
  }
  res.status(201).json({ ok: true });
});

router.delete("/saved/programs/:programId", async (req, res) => {
  const user = await requireUser(req, res);
  if (!user) return;

  const params = UnsaveProgramParams.safeParse({ programId: parseInt(req.params.programId) });
  if (!params.success) return res.status(400).json({ error: "Invalid id" });

  await db.delete(savedProgramsTable).where(
    and(eq(savedProgramsTable.userId, user.id), eq(savedProgramsTable.programId, params.data.programId))
  );
  res.status(204).send();
});

export default router;
