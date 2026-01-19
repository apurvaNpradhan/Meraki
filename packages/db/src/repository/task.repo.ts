import { and, desc, eq, isNull } from "drizzle-orm";
import type z from "zod";
import { db } from "..";
import type { InsertTaskSchema, UpdateTaskSchema } from "../lib/zod-schemas";
import { tasks } from "../schema";

export const getAllByWorkspaceId = async (args: { workspaceId: string }) => {
	return await db.query.tasks.findMany({
		where: and(
			isNull(tasks.deletedAt),
			eq(tasks.organizationId, args.workspaceId),
		),
		columns: {
			publicId: true,
			title: true,
			description: true,
			priority: true,
			position: true,
			deadline: true,
			completedAt: true,
			isArchived: true,
			createdAt: true,
			updatedAt: true,
			deletedAt: true,
		},
		with: {
			project: {
				columns: {
					publicId: true,
					name: true,
					colorCode: true,
					icon: true,
				},
			},
			status: {
				columns: {
					publicId: true,
					name: true,
					colorCode: true,
					type: true,
				},
			},
		},
	});
};

export const getAllByProjectId = async (args: { projectId: bigint }) => {
	return await db.query.tasks.findMany({
		where: and(isNull(tasks.deletedAt), eq(tasks.projectId, args.projectId)),
		columns: {
			publicId: true,
			title: true,
			description: true,
			priority: true,
			position: true,
			deadline: true,
			completedAt: true,
			isArchived: true,
			createdAt: true,
			updatedAt: true,
			deletedAt: true,
		},
		with: {
			project: {
				columns: {
					publicId: true,
					name: true,
					colorCode: true,
					icon: true,
				},
			},
			status: {
				columns: {
					publicId: true,
					name: true,
					colorCode: true,
					type: true,
				},
			},
		},
	});
};
export const getByPublicId = async (args: { taskId: string }) => {
	return await db.query.tasks.findFirst({
		where: and(eq(tasks.publicId, args.taskId), isNull(tasks.deletedAt)),
		columns: {
			publicId: true,
			title: true,
			description: true,
			priority: true,
			position: true,
			parentTaskId: true,
			assigneeId: true,
			deadline: true,
			completedAt: true,
			isArchived: true,
			createdAt: true,
			updatedAt: true,
			deletedAt: true,
		},
		with: {
			project: {
				columns: {
					publicId: true,
					name: true,
					colorCode: true,
					icon: true,
				},
			},
			status: {
				columns: {
					publicId: true,
					name: true,
					colorCode: true,
					type: true,
				},
			},
		},
	});
};

export const create = async (args: {
	input: z.infer<typeof InsertTaskSchema>;
}) => {
	const { input } = args;
	const [result] = await db
		.insert(tasks)
		.values({
			title: input.title,
			description: input.description,
			priority: input.priority,
			position: input.position,
			parentTaskId: input.parentTaskId,
			assigneeId: input.assigneeId,
			deadline: input.deadline,
			completedAt: input.completedAt,
			createdBy: input.createdBy,
			organizationId: input.organizationId,
			projectId: input.projectId,
			statusId: input.statusId,
			isArchived: false,
		})
		.returning({
			id: tasks.id,
			publicId: tasks.publicId,
		});
	return result;
};

export const update = async (args: {
	input: z.infer<typeof UpdateTaskSchema>;
	taskId: bigint;
}) => {
	const { input, taskId } = args;
	const [result] = await db
		.update(tasks)
		.set({
			title: input.title,
			description: input.description,
			priority: input.priority,
			position: input.position,
			parentTaskId: input.parentTaskId,
			isArchived: input.isArchived,
			assigneeId: input.assigneeId,
			deadline: input.deadline,
			completedAt: input.completedAt,
			projectId: input.projectId,
			statusId: input.statusId,
			updatedAt: new Date(),
		})
		.where(eq(tasks.id, taskId))
		.returning({
			id: tasks.id,
			publicId: tasks.publicId,
		});
	return result;
};

export const softDelete = async (args: {
	taskId: bigint;
	deletedBy: string;
}) => {
	const { taskId, deletedBy } = args;
	const [result] = await db
		.update(tasks)
		.set({
			deletedAt: new Date(),
			deletedBy,
		})
		.where(eq(tasks.id, taskId))
		.returning({
			id: tasks.id,
			publicId: tasks.publicId,
		});
	return result;
};

export const getIdByPublicId = async (args: { publicId: string }) => {
	return await db.query.tasks.findFirst({
		where: eq(tasks.publicId, args.publicId),
		columns: {
			id: true,
		},
	});
};

export const getLastPosition = async (args: { workspaceId: string }) => {
	const { workspaceId } = args;
	return await db.query.tasks.findFirst({
		where: eq(tasks.organizationId, workspaceId),
		columns: {
			position: true,
		},
		orderBy: [desc(tasks.position)],
	});
};
