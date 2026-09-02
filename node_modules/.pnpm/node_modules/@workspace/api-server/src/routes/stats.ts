import { Router } from "express";
import { db } from "@workspace/db";
import { schoolsTable, programsTable } from "@workspace/db";
import { sql, eq } from "drizzle-orm";

const router = Router();

router.get("/stats", async (req, res) => {
  const [schoolStats] = await db.select({
    total: sql<number>`count(*)::int`,
    public: sql<number>`count(*) filter (where type = 'Public')::int`,
    private: sql<number>`count(*) filter (where type = 'Private')::int`,
  }).from(schoolsTable);

  const [programStats] = await db.select({
    total: sql<number>`count(*)::int`,
  }).from(programsTable);

  res.json({
    totalSchools: schoolStats?.total || 0,
    totalPrograms: programStats?.total || 0,
    publicSchools: schoolStats?.public || 0,
    privateSchools: schoolStats?.private || 0,
  });
});

export default router;
