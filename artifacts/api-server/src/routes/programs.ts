import { Router } from "express";
import { getAuth } from "@clerk/express";
import { db } from "@workspace/db";
import { programsTable, schoolsTable, savedProgramsTable, usersTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import {
  ListProgramsQueryParams,
  CreateProgramBody,
  UpdateProgramBody,
  GetProgramParams,
  UpdateProgramParams,
  DeleteProgramParams,
} from "@workspace/api-zod";

const router = Router();

router.get("/programs", async (req, res) => {
  const params = ListProgramsQueryParams.safeParse(req.query);
  const query = params.success ? params.data : {};

  const auth = getAuth(req);
  let dbUser = null;
  if (auth.userId) {
    const found = await db.select().from(usersTable).where(eq(usersTable.clerkId, auth.userId)).limit(1);
    dbUser = found[0] || null;
  }

  const programs = await db
    .select({ program: programsTable, schoolName: schoolsTable.name })
    .from(programsTable)
    .leftJoin(schoolsTable, eq(programsTable.schoolId, schoolsTable.id));

  let filtered = programs;
  if (query.search) {
    const s = query.search.toLowerCase();
    filtered = filtered.filter(({ program }) =>
      program.name.toLowerCase().includes(s) ||
      program.description.toLowerCase().includes(s)
    );
  }
  if (query.category) {
    filtered = filtered.filter(({ program }) => program.category === query.category);
  }
  if (query.schoolId !== undefined) {
    filtered = filtered.filter(({ program }) => program.schoolId === query.schoolId);
  }
  if (query.strand) {
    filtered = filtered.filter(({ program }) => program.strand === query.strand);
  }

  let savedProgramIds = new Set<number>();
  if (dbUser) {
    const saved = await db.select().from(savedProgramsTable).where(eq(savedProgramsTable.userId, dbUser.id));
    savedProgramIds = new Set(saved.map(s => s.programId));
  }

  const result = filtered.map(({ program, schoolName }) => ({
    ...program,
    schoolName: schoolName || "",
    isSaved: savedProgramIds.has(program.id),
  }));

  res.json(result);
});

router.get("/programs/:id", async (req, res) => {
  const params = GetProgramParams.safeParse({ id: parseInt(req.params.id) });
  if (!params.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const program = await db
    .select({ program: programsTable, schoolName: schoolsTable.name })
    .from(programsTable)
    .leftJoin(schoolsTable, eq(programsTable.schoolId, schoolsTable.id))
    .where(eq(programsTable.id, params.data.id))
    .limit(1);

  if (!program.length) {
    res.status(404).json({ error: "Not found" });
    return;
  }

  res.json({ ...program[0].program, schoolName: program[0].schoolName || "", isSaved: false });
});

router.post("/programs", async (req, res) => {
  const body = CreateProgramBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error });
    return;
  }

  const school = await db.select().from(schoolsTable).where(eq(schoolsTable.id, body.data.schoolId)).limit(1);
  const [program] = await db.insert(programsTable).values(body.data).returning();
  res.status(201).json({ ...program, schoolName: school[0]?.name || "", isSaved: false });
});

router.patch("/programs/:id", async (req, res) => {
  const params = UpdateProgramParams.safeParse({ id: parseInt(req.params.id) });
  if (!params.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const body = UpdateProgramBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error });
    return;
  }

  const [program] = await db.update(programsTable).set(body.data).where(eq(programsTable.id, params.data.id)).returning();
  if (!program) {
    res.status(404).json({ error: "Not found" });
    return;
  }

  const school = await db.select().from(schoolsTable).where(eq(schoolsTable.id, program.schoolId)).limit(1);
  res.json({ ...program, schoolName: school[0]?.name || "", isSaved: false });
});

router.delete("/programs/:id", async (req, res) => {
  const params = DeleteProgramParams.safeParse({ id: parseInt(req.params.id) });
  if (!params.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  await db.delete(programsTable).where(eq(programsTable.id, params.data.id));
  res.status(204).send();
});

export default router;
