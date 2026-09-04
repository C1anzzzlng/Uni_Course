import { db, schoolsTable, programsTable } from "../../lib/db/src/index";

// Real, verified Taguig-area colleges/universities.
// Add more entries here any time — the script re-fetches each official
// site and extracts programs automatically, so you don't have to type
// program lists by hand.
const SCHOOLS = [
  {
    name: "University of Makati",
    type: "Public",
    address: "JP Rizal Extension, West Rembo, Taguig City, 1644 Metro Manila",
    website: "https://www.umak.edu.ph",
    latitude: 14.5627,
    longitude: 121.0560,
    strands: ["STEM", "ABM", "HUMSS", "GAS", "TVL"],
  },
  {
    name: "Polytechnic University of the Philippines - Taguig",
    type: "Public",
    address: "General Santos Avenue, Lower Bicutan, Taguig City, 1638 Metro Manila",
    website: "https://www.pup.edu.ph",
    latitude: 14.4882,
    longitude: 121.0516,
    strands: ["STEM", "ABM", "HUMSS", "GAS", "TVL"],
  },
  {
    name: "Taguig City University",
    type: "Public",
    address: "General Santos Avenue, Central Bicutan, Taguig City, Metro Manila",
    website: "https://tcu.edu.ph",
    latitude: 14.4911,
    longitude: 121.0555,
    strands: ["STEM", "ABM", "HUMSS", "GAS", "TVL"],
  },
  {
    name: "Enderun Colleges",
    type: "Private",
    address: "1100 Campus Avenue, McKinley Hill, Fort Bonifacio, Taguig City",
    website: "https://www.enderuncolleges.com",
    latitude: 14.5447,
    longitude: 121.0468,
    strands: ["STEM", "ABM", "HUMSS"],
  },
  {
    name: "MINT College (Meridian International Business, Arts and Technology College)",
    type: "Private",
    address: "2F Commerce and Industry Plaza, 1030 Campus Avenue, McKinley Hill, Fort Bonifacio, Taguig City",
    website: "https://mintcollege.com",
    latitude: 14.5452,
    longitude: 121.0466,
    strands: ["ABM", "HUMSS", "GAS"],
  },
  {
    name: "STI College Global City",
    type: "Private",
    address: "STI Academic Center, University Parkway Drive, Bonifacio Global City, Taguig City",
    website: "https://www.sti.edu",
    latitude: 14.5538,
    longitude: 121.0497,
    strands: ["STEM", "ABM", "HUMSS", "GAS", "TVL"],
  },
  {
    name: "Technological University of the Philippines - Taguig Campus",
    type: "Public",
    address: "Km. 14 East Service Road, South Super Highway, Taguig City, Metro Manila",
    website: "https://www.tup.edu.ph",
    latitude: 14.5089,
    longitude: 121.0468,
    strands: ["STEM", "TVL"],
  },
  {
    name: "University of the Philippines BGC",
    type: "Public",
    address: "9th Avenue, Bonifacio Global City, Taguig City",
    website: "https://www.up.edu.ph",
    latitude: 14.5514,
    longitude: 121.0489,
    strands: ["STEM", "ABM", "HUMSS", "GAS"],
  },
  {
    name: "De La Salle University - Rufino (BGC) Campus",
    type: "Private",
    address: "Rufino Tower, 6784 Ayala Avenue, Bonifacio Global City, Taguig City",
    website: "https://www.dlsu.edu.ph",
    latitude: 14.5533,
    longitude: 121.0508,
    strands: ["STEM", "ABM", "HUMSS"],
  },
  {
    name: "St. Chamuel College & Institute of Technology",
    type: "Private",
    address: "Taguig City, Metro Manila",
    website: "https://www.stchamuelcollege.edu.ph",
    latitude: 14.5243,
    longitude: 121.0790,
    strands: ["ABM", "HUMSS", "GAS", "TVL"],
  },
  {
    name: "Treston International College",
    type: "Private",
    address: "38th Street, University Parkway, Bonifacio Global City, Taguig City",
    website: "https://www.treston.edu.ph",
    latitude: 14.5533,
    longitude: 121.0508,
    strands: ["ABM", "HUMSS", "STEM"],
  },
  {
    name: "Lyceum International College",
    type: "Private",
    address: "Bonifacio Global City, Taguig City",
    website: "https://www.lyceuminternational.edu.ph",
    latitude: 14.5495,
    longitude: 121.0499,
    strands: ["ABM", "HUMSS", "GAS"],
  },
] as const;

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
  ).slice(0, 15);
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
    headers: { "user-agent": "Xlore-U-seed-script/1.0" },
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.text();
}

async function run() {
  console.log(`Seeding ${SCHOOLS.length} schools...`);

  for (const s of SCHOOLS) {
    console.log(`\n--- ${s.name} ---`);

    const [school] = await (db as any)
      .insert(schoolsTable)
      .values({
        name: s.name,
        type: s.type,
        address: s.address,
        description: `${s.name} is a higher education institution located in ${s.address}.`,
        tuitionMin: s.type === "Public" ? 0 : 40000,
        tuitionMax: s.type === "Public" ? 20000 : 120000,
        strands: [...s.strands],
        logoUrl: null,
        applicationUrl: s.website,
        latitude: s.latitude,
        longitude: s.longitude,
      })
      .returning();

    console.log(`  Inserted school id=${school.id}`);

    try {
      const html = await fetchHtml(s.website);
      const programNames = extractProgramNames(html);

      if (programNames.length === 0) {
        console.log("  No programs auto-detected from homepage.");
        continue;
      }

      for (const name of programNames) {
        const category = categoryForProgram(name);
        await (db as any).insert(programsTable).values({
          name,
          category,
          schoolId: school.id,
          description: `${name} offered at ${s.name}.`,
          requirements: [],
          careerPaths: [],
          strand: s.strands[0] ?? "STEM",
        });
      }
      console.log(`  Added ${programNames.length} auto-detected programs.`);
    } catch (err) {
      console.log(`  Could not fetch/parse ${s.website}: ${(err as Error).message}`);
    }
  }

  console.log("\nDone seeding.");
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
