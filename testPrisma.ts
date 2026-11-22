// testDB.ts
import { db } from "~/server/db";
import { users } from "./src/server/db/schema"; // ton schema Drizzle

async function testDB() {
  try {
    const result = await db.select().from(users).limit(1);
    console.log("Connexion DB OK :", result);
  } catch (err) {
    console.error("Erreur DB :", err);
  }
}

void testDB();
