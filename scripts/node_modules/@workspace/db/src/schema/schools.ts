import { pgTable, serial, text, integer, real, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const schoolsTable = pgTable("schools", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull().default("Private"), // Public | Private
  address: text("address").notNull(),
  description: text("description"),
  tuitionMin: integer("tuition_min").notNull().default(0),
  tuitionMax: integer("tuition_max").notNull().default(0),
  strands: text("strands").array().notNull().default([]),
  logoUrl: text("logo_url"),
  applicationUrl: text("application_url"),
  latitude: real("latitude"),
  longitude: real("longitude"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertSchoolSchema = createInsertSchema(schoolsTable).omit({ id: true, createdAt: true });
export type InsertSchool = z.infer<typeof insertSchoolSchema>;
export type School = typeof schoolsTable.$inferSelect;
