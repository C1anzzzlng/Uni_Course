import { db, schoolsTable } from "../../lib/db/src/index";
import { eq } from "drizzle-orm";

const updates: Array<{
  id: number;
  address: string;
  latitude: number;
  longitude: number;
}> = [
  { id: 1,  address: "JP Rizal Extension, West Rembo, Taguig City, Metro Manila", latitude: 14.5636, longitude: 121.0502 },
  { id: 2,  address: "General Santos Avenue, Central Bicutan, Taguig City", latitude: 14.5195, longitude: 121.0543 },
  { id: 3,  address: "No. 1100 Campus Avenue, McKinley Hill, Fort Bonifacio, Taguig City", latitude: 14.5447, longitude: 121.0468 },
  { id: 4,  address: "32nd Street corner C5 Road, Bonifacio Global City, Taguig City", latitude: 14.5492, longitude: 121.0503 },
  { id: 5,  address: "Km. 14 East Service Road, South Super Highway, Taguig City, Metro Manila", latitude: 14.5089, longitude: 121.0468 },
  { id: 6,  address: "General Santos Avenue, Central Bicutan, Taguig City", latitude: 14.5204, longitude: 121.0540 },
  { id: 7,  address: "2F Commerce and Industry Plaza, 1030 Campus Avenue, McKinley Hill, Fort Bonifacio, Taguig City", latitude: 14.5452, longitude: 121.0466 },
  { id: 8,  address: "3/F Bonifacio Technology Center, 31st Street corner Second Avenue, BGC, Taguig City", latitude: 14.5500, longitude: 121.0490 },
  { id: 9,  address: "No. 5, M. L. Quezon Street, Barangay Hagonoy, Taguig City", latitude: 14.5023, longitude: 121.0462 },
  { id: 10, address: "7 Col. Bernardo Street, Zone 4 Signal Village, Taguig City", latitude: 14.5150, longitude: 121.0526 },
  { id: 11, address: "38th Street, University Parkway, Bonifacio Global City, Taguig City", latitude: 14.5533, longitude: 121.0508 },
  { id: 12, address: "32nd Street (beside International School), Bonifacio Global City, Taguig City", latitude: 14.5495, longitude: 121.0499 },
  { id: 13, address: "STI Academic Center, University Parkway Drive, Bonifacio Global City, Taguig City", latitude: 14.5538, longitude: 121.0497 },
  { id: 14, address: "83 General Luna Street, Barangay Tuktukan, Taguig City", latitude: 14.5167, longitude: 121.0538 },
  { id: 15, address: "4th Floor, Sunshine Plaza Mall, FTI Complex, Taguig City, Metro Manila", latitude: 14.5135, longitude: 121.0519 },
  { id: 16, address: "Taguig City, Metro Manila", latitude: 14.5243, longitude: 121.0790 },
  { id: 17, address: "No. 30 Bayani Road, AFPOVAI Phase III, Fort Bonifacio, Taguig City", latitude: 14.5298, longitude: 121.0544 },
  { id: 18, address: "Ramirez Street, Barangay Tuktukan, Taguig City", latitude: 14.5172, longitude: 121.0543 },
  { id: 19, address: "Rajah Sumakwel Street, Taguig City", latitude: 14.5260, longitude: 121.0553 },
  { id: 20, address: "503 Eagle Street, Blk. 5, G2 Village, Barangay Pinagsama, Taguig City", latitude: 14.5310, longitude: 121.0490 },
  { id: 21, address: "4/F Gate 3 Plaza, Lawton Avenue corner Juliano Avenue, Western Bicutan, Taguig City", latitude: 14.5270, longitude: 121.0520 },
  { id: 22, address: "4F Piedra Bldg., 1174 Chino Roces Ave., San Antonio Village, Makati City (nearest campus)", latitude: 14.5556, longitude: 121.0137 },
];

async function run() {
  console.log("Updating school addresses and coordinates...");
  for (const upd of updates) {
    await (db as any).update(schoolsTable).set({
      address: upd.address,
      latitude: upd.latitude,
      longitude: upd.longitude,
    }).where(eq(schoolsTable.id, upd.id));
    console.log(`  Updated school ID ${upd.id}: ${upd.address}`);
  }
  console.log("Done!");
  process.exit(0);
}

run().catch(e => { console.error(e); process.exit(1); });
