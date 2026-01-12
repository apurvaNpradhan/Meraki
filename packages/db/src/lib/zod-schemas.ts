import {
	createInsertSchema,
	createSelectSchema,
	createUpdateSchema,
} from "drizzle-zod";
import z from "zod";
import {
	bodyPartsData,
	equipmentsData,
	muscleGroupsData,
} from "../data/exercises";
import { exercises } from "../schema/exercise";
export const SelectExercise = createSelectSchema(exercises, {}).extend({
	exerciseId: z.string(),
});

export const InsertExercise = createInsertSchema(exercises, {
	name: z.string().min(1, "Name is required"),
	gifUrl: z.url("Invalid gif url"),
	thumbnailUrl: z.url("Invalid thumbnail url"),
	targetMuscles: z.array(z.enum(muscleGroupsData)),
	bodyParts: z.array(z.enum(bodyPartsData)),
	equipments: z.array(z.enum(equipmentsData)),
	secondaryMuscles: z.array(z.enum(muscleGroupsData)),
	instructions: z.array(z.string()).min(1, "Instructions is required"),
}).omit({
	publicId: true,
	updatedAt: true,
	createdAt: true,
	deletedAt: true,
});

export const UpdateExercise = createUpdateSchema(exercises).omit({
	createdAt: true,
	deletedAt: true,
});
