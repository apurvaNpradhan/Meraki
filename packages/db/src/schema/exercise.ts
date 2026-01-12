import { sql } from "drizzle-orm";
import {
	boolean,
	index,
	integer,
	jsonb,
	pgTable,
	text,
	uuid,
} from "drizzle-orm/pg-core";
import type { BodyPart, Equipment, Muscle } from "../data/exercises";
import { timestamps } from "../utils/timestamps";
import { user } from "./auth";

export const exercises = pgTable(
	"exercises",
	{
		id: integer("id").generatedAlwaysAsIdentity().primaryKey(),
		publicId: uuid("public_id")
			.default(sql`uuid_generate_v7()`)
			.unique()
			.notNull(),
		name: text("name").notNull(),
		gifUrl: text("gif_url").notNull(),
		thumbnailUrl: text("thumbnail_url").notNull(),
		targetMuscles: jsonb("target_muscles").$type<Muscle[]>().notNull(),
		bodyParts: jsonb("body_parts").$type<BodyPart[]>().notNull(),
		equipments: jsonb("equipments").$type<Equipment[]>().notNull(),
		secondaryMuscles: jsonb("secondary_muscles").$type<Muscle[]>().notNull(),
		instructions: jsonb("instructions").$type<string[]>().notNull(),
		isSystem: boolean("is_system").notNull(),
		createdBy: uuid("created_by").references(() => user.id),
		...timestamps,
	},
	(t) => [index("created_by_idx").on(t.createdBy)],
);
