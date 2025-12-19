import dotenv from "dotenv";
dotenv.config();

import { db } from "../src/lib/db/index.js";
import { hikes } from "../src/lib/db/schemas/index.js";

async function testInsert() {
  console.log("Testing hike insert...\n");

  try {
    const result = await db
      .insert(hikes)
      .values({
        name: "Test Hike",
        description: "Test description",
        addressId: null,
        difficulty: "easy",
        distance: "3",
        distanceUnit: "miles",
        duration: "3",
        durationUnit: "hours",
        elevation: "3",
        elevationUnit: "feet",
        trailType: "Loop",
        features: ["Dog Friendly", "Lake"],
        permitsRequired: "test",
        bestSeason: ["spring"],
        waterSources: false,
        parkingInfo: "free",
        status: "pending",
        createdBy: "26f210a0-9e3b-4025-915d-9ad8c7749f5d",
      })
      .returning();

    console.log("✓ Insert successful!");
    console.log("Result:", result);

    // Clean up
    if (result[0]) {
      await db.delete(hikes).where(({ id }) => id === result[0].id);
      console.log("✓ Test data cleaned up");
    }
  } catch (error: any) {
    console.error("✗ Insert failed!");
    console.error("Error message:", error.message);
    console.error("\nFull error:", error);

    // Check for specific error types
    if (error.code) {
      console.error("\nPostgreSQL Error Code:", error.code);
    }
    if (error.constraint) {
      console.error("Constraint:", error.constraint);
    }
  }
}

testInsert();
