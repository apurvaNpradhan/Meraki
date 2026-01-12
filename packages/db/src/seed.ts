import { neon, neonConfig } from "@neondatabase/serverless";
import * as dotenv from "dotenv";
import { drizzle } from "drizzle-orm/neon-http";
import ws from "ws";
import {
	type BodyPart,
	type Equipment,
	ExercisesSeedData,
	type Muscle,
} from "./data/exercises";
import { exercises } from "./schema/exercise";

dotenv.config({
	path: "../../apps/server/.env",
});
neonConfig.webSocketConstructor = ws;
neonConfig.poolQueryViaFetch = true;

const sql = neon(process.env.DATABASE_URL || "");
const db = drizzle(sql);

async function main() {
	console.log("Seeding data...");
	await db
		.insert(exercises)
		.values(
			ExercisesSeedData.map((exercise) => ({
				publicId: exercise.public_id,
				name: exercise.name,
				gifUrl: exercise.gif_url,
				thumbnailUrl: "https://picsum.photos/200",
				targetMuscles: exercise.target_muscles as Muscle[],
				bodyParts: exercise.body_parts as BodyPart[],
				equipments: exercise.equipments as Equipment[],
				secondaryMuscles: exercise.secondary_muscles as Muscle[],
				instructions: exercise.instructions,
				isSystem: true,
				createdAt: new Date(exercise.created_at),
				createdBy: exercise.created_by,
			})),
		)
		.onConflictDoNothing();
	console.log("Seeding Finished");
	process.exit(0);
}
main()
	.then()
	.catch((err) => {
		console.error(err);
		process.exit(0);
	});
