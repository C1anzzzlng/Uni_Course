import { Router } from "express";
import { getAuth } from "@clerk/express";
import { db } from "@workspace/db";
import { schoolsTable, programsTable, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

const PROGRAM_WORDS = /\b(program|course|degree|bachelor|master|undergraduate|graduate|associate|diploma|major|academic)\b/i;
const SUBJECT_WORDS = /\b(accountancy|accounting|architecture|business|communication|computer|criminal|education|engineering|fine arts|hospitality|information technology|journalism|marketing|medical|nursing|psychology|science|social work|tourism|technology)\b/i;

function cleanHtml(value: string): string {
  return value
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;|&#160;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function absoluteUrl(href: string, base: string): string | null {
  try {
    const url = new URL(href, base);
    return url.protocol === "http:" || url.protocol === "https:" ? url.toString() : null;
  } catch {
    return null;
  }
}

function extractProgramNames(html: string): string[] {
  const candidates: string[] = [];
  const blockPattern = /<(?:h1|h2|h3|h4|li|a)[^>]*>([\s\S]*?)<\/(?:h1|h2|h3|h4|li|a)>/gi;
  for (const match of html.matchAll(blockPattern)) {
    const text = cleanHtml(match[1]);
    if (text.length >= 5 && text.length <= 120 && (PROGRAM_WORDS.test(text) || SUBJECT_WORDS.test(text))) {
      candidates.push(text.replace(/\s*[|•·]\s*.*$/, "").trim());
    }
  }
  return Array.from(new Set(candidates)).filter(name =>
    !/^(programs?|courses?|degrees?|academics?|undergraduate|graduate|learn more|view all)$/i.test(name)
  ).slice(0, 80);
}

function categoryForProgram(name: string): string {
  const value = name.toLowerCase();
  if (/nurs|medical|health|pharmacy|therapy/.test(value)) return "Health Sciences";
  if (/engineer|computer|information technology|technology|science/.test(value)) return "STEM";
  if (/business|account|market|management|entrepreneur|finance/.test(value)) return "Business";
  if (/education|teacher/.test(value)) return "Education";
  if (/art|design|communication|journal/.test(value)) return "Arts & Communication";
  return "Other";
}

async function fetchHtml(url: string): Promise<string> {
  const response = await fetch(url, {
    signal: AbortSignal.timeout(8000),
    headers: { "user-agent": "Xlore-U-directory-refresh/1.1" },
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.text();
}

router.post("/admin/refresh-schools", async (req, res) => {
  const auth = getAuth(req);
  const clerkId = auth.userId;
  if (!clerkId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const user = (await db.select().from(usersTable).where(eq(usersTable.clerkId, clerkId)).limit(1))[0];
  if (!user || user.role !== "admin") {
    res.status(403).json({ error: "Admin access required" });
    return;
  }

  const schools = await db.select().from(schoolsTable);
  const existingPrograms = await db.select().from(programsTable);
  let checked = 0;
  let updated = 0;
  let programsAdded = 0;
  const failures: string[] = [];

  for (const school of schools) {
    if (!school.applicationUrl) continue;
    checked++;
    try {
      const html = await fetchHtml(school.applicationUrl);
      const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.replace(/\s+/g, " ").trim();
      const description = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i)?.[1]?.trim();
      const nextDescription = description || (title ? `${school.name} — ${title}` : null);
      if (nextDescription && nextDescription !== school.description) {
        await db.update(schoolsTable).set({ description: nextDescription }).where(eq(schoolsTable.id, school.id));
        updated++;
      }

      const discoveredUrls = Array.from(html.matchAll(/href=["']([^"']+)["']/gi))
        .map(match => absoluteUrl(match[1], school.applicationUrl!))
        .filter((url): url is string => Boolean(url))
        .filter(url => {
          try {
            const base = new URL(school.applicationUrl!);
            const target = new URL(url);
            return target.hostname === base.hostname && /(program|course|academic|degree|undergraduate|college)/i.test(target.pathname + target.search);
          } catch {
            return false;
          }
        })
        .slice(0, 4);
      const programPages = [school.applicationUrl, ...discoveredUrls.filter(url => url !== school.applicationUrl)];
      const names = new Set<string>();
      for (const pageUrl of programPages) {
        try {
          const pageHtml = pageUrl === school.applicationUrl ? html : await fetchHtml(pageUrl);
          extractProgramNames(pageHtml).forEach(name => names.add(name));
        } catch {
          // The institution homepage was still refreshed; an optional program page may be unavailable.
        }
      }
      for (const name of names) {
        const normalized = name.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
        const alreadyExists = existingPrograms.some(program =>
          program.schoolId === school.id &&
          program.name.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim() === normalized
        );
        if (alreadyExists || normalized.length < 4) continue;
        const [program] = await db.insert(programsTable).values({
          name,
          category: categoryForProgram(name),
          schoolId: school.id,
          description: `Program information sourced from ${school.name}'s official website.`,
          requirements: [],
          careerPaths: [],
          strand: "General",
        }).returning();
        existingPrograms.push(program);
        programsAdded++;
      }
    } catch (error) {
      failures.push(`${school.name}: ${error instanceof Error ? error.message : "refresh failed"}`);
    }
  }

  res.json({ checked, updated, programsAdded, failed: failures.length, failures });
});

export default router;