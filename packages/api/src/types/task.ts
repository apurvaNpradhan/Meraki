import {
	InsertTaskSchema,
	TaskSchema,
	UpdateTaskSchema,
} from "@meraki/db/lib/zod-schemas";
import type { TaskStatus } from "@meraki/db/schema/task";
import z from "zod";

export const InsertTaskInput = InsertTaskSchema.omit({
	parentTaskId: true,
	createdBy: true,
	organizationId: true,
}).extend({
	parentTaskPublicId: z.string().optional(),
});

export const UpdateTaskInput = UpdateTaskSchema.omit({}).extend({
	taskPublicId: z.string(),
	parentTaskPublicId: z.string().optional(),
});

export const SelectTask = TaskSchema;

export type SelectTaskType = z.infer<typeof SelectTask>;
export type InsertTaskType = z.infer<typeof InsertTaskInput>;
export type UpdateTaskType = z.infer<typeof UpdateTaskInput>;

export type TaskStatusType = TaskStatus;
