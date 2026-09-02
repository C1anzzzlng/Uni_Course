import { Router } from "express";
import { db } from "@workspace/db";
import { schoolsTable, savedSchoolsTable, usersTable } from "@workspace/db";
import { eq, ilike, and, gte, lte, sql, arrayContains } from "drizzle-orm";
import {
  ListSchoolsQueryParams,
  CreateSchoolBody,
  UpdateSchoolBody,
  GetSchoolParams,
  UpdateSchoolParams,
  DeleteSchoolParams,
} from "@workspace/api-zod";

const router = Router();

async function getOrCreateUser(clerkId: string, name: string, email: string) {
  const existing = await db.select().from(usersTable).where(eq(usersTable.clerkId, clerkId)).limit(1);
  if (existing.length > 0) return existing[0];
  const [user] = await db.insert(usersTable).values({ clerkId, name, email, role: "user" }).returning();
  return user;
}

router.get("/schools", async (req, res) => {
  const params = ListSchoolsQueryParams.safeParse(req.query);
  const query = params.success ? params.data : {};

  const clerkUser = req.auth?.userId ? req.auth : null;
  let dbUser = null;
  if (clerkUser?.userId) {
    const found = await db.select().from(usersTable).where(eq(usersTable.clerkId, clerkUser.userId)).limit(1);
    dbUser = found[0] || null;
  }

  let schools = await db.select().from(schoolsTable);

  let filtered = schools;
  if (query.search) {
    const s = query.search.toLowerCase();
    filtered = filtered.filter(sc =>
      sc.name.toLowerCase().includes(s) ||
      (sc.address && sc.address.toLowerCase().includes(s)) ||
      (sc.description && sc.description.toLowerCase().includes(s))
    );
  }
  if (query.type) {
    filtered = filtered.filter(sc => sc.type === query.type);
  }
  if (query.tuitionMin !== undefined) {
    filtered = filtered.filter(sc => sc.tuitionMax >= query.tuitionMin!);
  }
  if (query.tuitionMax !== undefined) {
    filtered = filtered.filter(sc => sc.tuitionMin <= query.tuitionMax!);
  }
  if (query.strand) {
    filtered = filtered.filter(sc => sc.strands && sc.strands.includes(query.strand!));
  }

  let savedSchoolIds = new Set<number>();
  if (dbUser) {
    const saved = await db.select().from(savedSchoolsTable).where(eq(savedSchoolsTable.userId, dbUser.id));
    savedSchoolIds = new Set(saved.map(s => s.schoolId));
  }

  const result = filtered.map(sc => ({
    ...sc,
    isSaved: savedSchoolIds.has(sc.id),
  }));

  res.json(result);
});

router.get("/schools/:id", async (req, res) => {
  const params = GetSchoolParams.safeParse({ id: parseInt(req.params.id) });
  if (!params.success) return res.status(400).json({ error: "Invalid id" });

  const clerkUser = req.auth?.userId ? req.auth : null;
  let dbUser = null;
  if (clerkUser?.userId) {
    const found = await db.select().from(usersTable).where(eq(usersTable.clerkId, clerkUser.userId)).limit(1);
    dbUser = found[0] || null;
  }

  const { programsTable } = await import("@workspace/db");

  const school = await db.select().from(schoolsTable).where(eq(schoolsTable.id, params.data.id)).limit(1);
  if (!school.length) return res.status(404).json({ error: "Not found" });

  const programs = await db.select().from(programsTable).where(eq(programsTable.schoolId, params.data.id));

  let isSaved = false;
  if (dbUser) {
    const saved = await db.select().from(savedSchoolsTable).where(
      and(eq(savedSchoolsTable.userId, dbUser.id), eq(savedSchoolsTable.schoolId, params.data.id))
    ).limit(1);
    isSaved = saved.length > 0;
  }

  res.json({
    ...school[0],
    isSaved,
    programs: programs.map(p => ({
      ...p,
      schoolName: school[0].name,
      isSaved: false,
    })),
  });
});

router.post("/schools", async (req, res) => {
  const body = CreateSchoolBody.safeParse(req.body);
  if (!body.success) return res.status(400).json({ error: body.error });

  const [school] = await db.insert(schoolsTable).values(body.data).returning();
  res.status(201).json({ ...school, isSaved: false });
});

router.patch("/schools/:id", async (req, res) => {
  const params = UpdateSchoolParams.safeParse({ id: parseInt(req.params.id) });
  if (!params.success) return res.status(400).json({ error: "Invalid id" });

  const body = UpdateSchoolBody.safeParse(req.body);
  if (!body.success) return res.status(400).json({ error: body.error });

  const [school] = await db.update(schoolsTable).set(body.data).where(eq(schoolsTable.id, params.data.id)).returning();
  if (!school) return res.status(404).json({ error: "Not found" });
  res.json({ ...school, isSaved: false });
});

router.delete("/schools/:id", async (req, res) => {
  const params = DeleteSchoolParams.safeParse({ id: parseInt(req.params.id) });
  if (!params.success) return res.status(400).json({ error: "Invalid id" });

  await db.delete(schoolsTable).where(eq(schoolsTable.id, params.data.id));
  res.status(204).send();
});

export default router;
