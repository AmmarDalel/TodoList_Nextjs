/* ************************************************************************** */
/*                                Dépendances                                */
/* ************************************************************************** */
import { timestamp, pgTable, text, integer, uuid } from "drizzle-orm/pg-core";

/* ************************************************************************** */
/*                                Schéma Utilisateurs                        */
/* ************************************************************************** */
export const users = pgTable("user", {
  // Identifiant unique UUID généré automatiquement
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name"),
  email: text("email").unique().notNull(),
  password: text("password"),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
});

/* ************************************************************************** */
/*                                Schéma Tâches                              */
/* ************************************************************************** */
export const tasks = pgTable("task", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description").default(""),
  isDone: integer("isDone").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});
