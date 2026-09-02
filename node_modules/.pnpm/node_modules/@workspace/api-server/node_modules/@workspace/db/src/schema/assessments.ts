import { pgTable, serial, integer, text, timestamp } from "drizzle-orm/pg-core";
import { usersTable } from "./users";

export const assessmentsTable = pgTable("assessments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  answers: text("answers").notNull(), // JSON string
  recommendedPrograms: text("recommended_programs").array().notNull().default([]),
  createdAt: timestamp("created_at").defaultNow(),
});
