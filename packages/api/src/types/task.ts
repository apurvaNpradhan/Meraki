import {
	InsertTaskSchema,
	TaskSchema,
	UpdateTaskSchema,
} from "@meraki/db/lib/zod-schemas";
import z from "zod";
import type { Status, StatusType } from "./status";

export const InsertTaskInput = InsertTaskSchema.omit({
	parentTaskId: true,
	createdBy: true,
	assigneeId: true,
	position: true,
	organizationId: true,
	projectId: true,
	statusId: true,
}).extend({
	parentTaskPublicId: z.string().optional(),
	projectPublicId: z.string().optional(),
	statusPublicId: z.string().optional(),
});

export const UpdateTaskInput = UpdateTaskSchema.omit({
	projectId: true,
	statusId: true,
}).extend({
	taskPublicId: z.string(),
	parentTaskPublicId: z.string().optional(),
	projectPublicId: z.string().optional(),
	statusPublicId: z.string().optional(),
});

export const SelectTask = TaskSchema.omit({
	statusId: true,
	projectId: true,
}).extend({
	status: z
		.object({
			publicId: z.string(),
			name: z.string(),
		})
		.nullable(),
	project: z
		.object({
			publicId: z.string(),
			name: z.string(),
		})
		.nullable(),
});

export type SelectTaskType = z.infer<typeof SelectTask>;
export type InsertTaskType = z.infer<typeof InsertTaskInput>;
export type UpdateTaskType = z.infer<typeof UpdateTaskInput>;

export type TaskStatus = Status;
export type TaskStatusesType = StatusType;
