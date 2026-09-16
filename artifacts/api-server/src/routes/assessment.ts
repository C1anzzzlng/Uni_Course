import { Router } from "express";
import { getAuth } from "@clerk/express";
import { db } from "@workspace/db";
import { assessmentsTable, usersTable, programsTable, schoolsTable, savedSchoolsTable } from "@workspace/db";
import { eq, inArray, desc } from "drizzle-orm";
import { SubmitAssessmentBody } from "@workspace/api-zod";

const router = Router();

// Map assessment answers to program categories and strands
function computeRecommendations(answers: { questionId: string; answer: string }[]): string[] {
  const answerMap: Record<string, string[]> = {
    // Interest
    "Technology & Computers": ["Information Technology", "Computer Science", "Computer Engineering Technology", "Computer Systems Technology"],
    "Health & Medicine": ["Nursing", "Physical Therapy", "Medical Technology", "Midwifery", "Healthcare Management"],
    "Business & Finance": ["Business Administration", "Accountancy", "Management", "Marketing", "Entrepreneurship"],
    "Arts & Design": ["Fine Arts", "Architecture", "Interior Design", "Graphic Design", "Fashion Design"],
    "Education & Teaching": ["Education", "Elementary Education", "Secondary Education", "Early Childhood Education"],
    "Engineering & Construction": ["Civil Engineering Technology", "Electrical Technology", "Industrial Technology", "Computer Engineering Technology"],
    // Skills
    "Problem Solving": ["Computer Science", "Engineering", "Information Technology", "Mathematics", "Architecture"],
    "Communication": ["Communication Arts", "Journalism", "Marketing", "Education", "Public Administration"],
    "Creative Work": ["Fine Arts", "Graphic Design", "Interior Design", "Fashion Design", "Architecture"],
    "Numbers & Analysis": ["Accountancy", "Business Administration", "Computer Science", "Mathematics", "Management"],
    "Helping Others": ["Nursing", "Social Work", "Education", "Psychology", "Healthcare Management"],
    "Technical Work": ["Computer Engineering Technology", "Electrical Technology", "Industrial Technology", "Civil Engineering Technology"],
    // Learning style
    "Hands-on Practice": ["Industrial Technology", "Nursing", "Computer Engineering Technology", "Culinary Arts"],
    "Reading & Research": ["Psychology", "Political Science", "Education", "Communication Arts"],
    "Group Discussions": ["Business Administration", "Public Administration", "Education", "Social Work"],
    "Watching Demonstrations": ["Medical Technology", "Physical Therapy", "Architecture", "Fine Arts"],
    "Independent Study": ["Computer Science", "Information Technology", "Accountancy", "Mathematics"],
    // Career goals
    "Government & Public Service": ["Public Administration", "Political Science", "Social Work", "Education"],
    "Business & Entrepreneurship": ["Business Administration", "Marketing", "Entrepreneurship", "Management", "Accountancy"],
    "Healthcare & Medicine": ["Nursing", "Medical Technology", "Physical Therapy", "Healthcare Management", "Midwifery"],
    "Engineering & Technology": ["Computer Engineering Technology", "Civil Engineering Technology", "Electrical Technology", "Information Technology"],
    "Arts & Creative Industries": ["Fine Arts", "Graphic Design", "Interior Design", "Fashion Design", "Communication Arts"],
    "Education & Academia": ["Education", "Elementary Education", "Secondary Education", "Psychology"],
    // Strands
    "ABM (Accountancy, Business, Management)": ["Business Administration", "Accountancy", "Marketing", "Management", "Entrepreneurship"],
    "HUMSS (Humanities & Social Sciences)": ["Psychology", "Social Work", "Political Science", "Education", "Communication Arts"],
    "STEM (Science, Technology, Engineering, Math)": ["Computer Science", "Civil Engineering Technology", "Medical Technology", "Mathematics", "Physical Therapy"],
    "ICT (Information & Communications Technology)": ["Information Technology", "Computer Science", "Computer Engineering Technology", "Computer Systems Technology"],
    "GAS (General Academic Strand)": ["Business Administration", "Education", "Public Administration", "Management"],
    "TVL (Technical-Vocational-Livelihood)": ["Industrial Technology", "Electrical Technology", "Computer Engineering Technology", "Culinary Arts", "Healthcare Management"],
  };

  const recommended = new Set<string>();

  for (const answer of answers) {
    const programs = answerMap[answer.answer];
    if (programs) {
      for (const prog of programs) {
        recommended.add(prog);
      }
    }
  }

  // If still empty, return general programs
  if (recommended.size === 0) {
    return ["Business Administration", "Information Technology", "Education", "Nursing", "Computer Science", "Management"];
  }

  // Count frequency — programs appearing from multiple answers rank higher
  const freq: Record<string, number> = {};
  for (const answer of answers) {
    const programs = answerMap[answer.answer] || [];
    for (const prog of programs) {
      freq[prog] = (freq[prog] || 0) + 1;
    }
  }

  return Array.from(recommended)
    .sort((a, b) => (freq[b] || 0) - (freq[a] || 0))
    .slice(0, 8);
}

async function requireUser(req: any, res: any) {
  const auth = getAuth(req);
  const clerkId = auth.userId;
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

router.post("/assessment", async (req, res) => {
  const body = SubmitAssessmentBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error });
    return;
  }

  const recommendedPrograms = computeRecommendations(body.data.answers);

  // Find matching schools based on recommended programs
  const allPrograms = await db
    .select({ program: programsTable, school: schoolsTable })
    .from(programsTable)
    .leftJoin(schoolsTable, eq(programsTable.schoolId, schoolsTable.id));

  const matchedSchoolIds = new Set<number>();
  for (const { program, school } of allPrograms) {
    if (recommendedPrograms.some(rp => program.name.toLowerCase().includes(rp.toLowerCase()))) {
      if (school) matchedSchoolIds.add(school.id);
    }
  }

  // Get all schools if no specific matches, else return top matches
  let matchedSchools: any[] = [];
  if (matchedSchoolIds.size > 0) {
    const schoolIds = Array.from(matchedSchoolIds).slice(0, 6);
    matchedSchools = await db.select().from(schoolsTable).where(inArray(schoolsTable.id, schoolIds));
  } else {
    matchedSchools = await db.select().from(schoolsTable).limit(6);
  }

  // Attempt to save if user is authenticated — auth failure is not fatal
  let assessmentId: number | null = null;
  let completedAt = new Date().toISOString();
  const auth = getAuth(req);
  const clerkId = auth.userId;
  if (clerkId) {
    try {
      const found = await db.select().from(usersTable).where(eq(usersTable.clerkId, clerkId)).limit(1);
      const userRow = found.length > 0
        ? found[0]
        : (await db.insert(usersTable).values({ clerkId, name: "User", email: "", role: "user" }).returning())[0];

      const [assessment] = await db.insert(assessmentsTable).values({
        userId: userRow.id,
        answers: JSON.stringify(body.data.answers),
        recommendedPrograms,
      }).returning();

      assessmentId = assessment.id;
      completedAt = assessment.createdAt?.toISOString() || completedAt;
    } catch {
      // Non-fatal: return results even if save fails
    }
  }

  res.json({
    id: assessmentId ?? 0,
    recommendedPrograms,
    matchedSchools: matchedSchools.map(s => ({ ...s, isSaved: false })),
    completedAt,
  });
});

router.get("/assessment", async (req, res) => {
  const user = await requireUser(req, res);
  if (!user) return;

  const assessments = await db
    .select()
    .from(assessmentsTable)
    .where(eq(assessmentsTable.userId, user.id))
    .orderBy(desc(assessmentsTable.createdAt))
    .limit(1);

  if (!assessments.length) {
    res.status(404).json({ error: "No assessment yet" });
    return;
  }

  const assessment = assessments[0];
  const recommendedPrograms = assessment.recommendedPrograms || [];

  // Find matching schools
  const allPrograms = await db
    .select({ program: programsTable, school: schoolsTable })
    .from(programsTable)
    .leftJoin(schoolsTable, eq(programsTable.schoolId, schoolsTable.id));

  const matchedSchoolIds = new Set<number>();
  for (const { program, school } of allPrograms) {
    if (recommendedPrograms.some((rp: string) => program.name.toLowerCase().includes(rp.toLowerCase()))) {
      if (school) matchedSchoolIds.add(school.id);
    }
  }

  let matchedSchools: any[] = [];
  if (matchedSchoolIds.size > 0) {
    const schoolIds = Array.from(matchedSchoolIds).slice(0, 6);
    matchedSchools = await db.select().from(schoolsTable).where(inArray(schoolsTable.id, schoolIds));
  } else {
    matchedSchools = await db.select().from(schoolsTable).limit(6);
  }

  // Get saved schools for the user
  const saved = await db.select().from(savedSchoolsTable).where(eq(savedSchoolsTable.userId, user.id));
  const savedIds = new Set(saved.map(s => s.schoolId));

  res.json({
    id: assessment.id,
    recommendedPrograms,
    matchedSchools: matchedSchools.map(s => ({ ...s, isSaved: savedIds.has(s.id) })),
    completedAt: assessment.createdAt?.toISOString() || new Date().toISOString(),
  });
});

export default router;
