import * as projectRepo from "@meraki/db/repository/project.repo";
import * as statusRepo from "@meraki/db/repository/status.repo";
import * as taskRepo from "@meraki/db/repository/task.repo";
import { ORPCError } from "@orpc/client";
import { generateKeyBetween } from "fractional-indexing";
import z from "zod";
import { protectedProcedure } from "..";
import { InsertTaskInput, UpdateTaskInput } from "../types/task";

export const TaskRouter = {
	all: protectedProcedure.handler(async ({ context }) => {
		if (!context.session.session.activeOrganization?.id) {
			throw new ORPCError("NOT_FOUND", {
				message: "Organization not found",
			});
		}
		const result = await taskRepo.getAllByWorkspaceId({
			workspaceId: context.session.session.activeOrganization?.id,
		});
		return result;
	}),
	allByProjectId: protectedProcedure
		.input(z.object({ projectPublicId: z.string() }))
		.handler(async ({ input, context }) => {
			const project = await projectRepo.getProjectIdByPublicId(
				input.projectPublicId,
			);
			if (!project) {
				throw new ORPCError("NOT_FOUND", {
					message: `project with public ID ${input.projectPublicId} not found`,
				});
			}
			const result = await taskRepo.getAllByProjectId({
				projectId: project.id,
			});
			return result;
		}),
	byId: protectedProcedure
		.input(z.object({ taskId: z.string() }))
		.handler(async ({ context, input }) => {
			if (!context.session.session.activeOrganization?.id) {
				throw new ORPCError("NOT_FOUND", {
					message: "Organization not found",
				});
			}
			const result = await taskRepo.getByPublicId({ taskId: input.taskId });
			return result;
		}),
	create: protectedProcedure
		.input(
			z.object({
				input: InsertTaskInput,
			}),
		)
		.handler(async ({ context, input }) => {
			if (!context.session.session.activeOrganization?.id) {
				throw new ORPCError("NOT_FOUND", {
					message: "Organization not found",
				});
			}

			let projectId: bigint | undefined;
			if (input.input.projectPublicId) {
				const project = await projectRepo.getProjectIdByPublicId(
					input.input.projectPublicId,
				);
				projectId = project?.id;
			}

			let statusId: bigint | undefined;
			if (input.input.statusPublicId) {
				const status = await statusRepo.getIdByPublicId(
					input.input.statusPublicId,
				);
				statusId = status?.id;
			}

			const lastPosition = await taskRepo.getLastPosition({
				workspaceId: context.session.session.activeOrganization?.id,
			});
			const newPosition = generateKeyBetween(lastPosition?.position, null);
			const result = await taskRepo.create({
				input: {
					...input.input,
					assigneeId: context.session.user.id,
					organizationId: context.session.session.activeOrganization?.id,
					createdBy: context.session.user.id,
					position: newPosition,
					projectId,
					statusId,
				},
			});
			return result;
		}),
	update: protectedProcedure
		.input(
			z.object({
				input: UpdateTaskInput,
				taskId: z.string(),
				workspaceId: z.string(),
			}),
		)
		.handler(async ({ context, input }) => {
			if (!context.session.session.activeOrganization?.id) {
				throw new ORPCError("NOT_FOUND", {
					message: "Organization not found",
				});
			}
			const taskId = await taskRepo.getIdByPublicId({ publicId: input.taskId });
			if (!taskId) {
				throw new ORPCError("NOT_FOUND", {
					message: "Task not found",
				});
			}

			let projectId: bigint | undefined;
			if (input.input.projectPublicId) {
				const project = await projectRepo.getProjectIdByPublicId(
					input.input.projectPublicId,
				);
				projectId = project?.id;
			}

			let statusId: bigint | undefined;
			if (input.input.statusPublicId) {
				const status = await statusRepo.getIdByPublicId(
					input.input.statusPublicId,
				);
				statusId = status?.id;
			}

			const result = await taskRepo.update({
				input: {
					...input.input,
					projectId,
					statusId,
				},
				taskId: taskId?.id,
			});
			return result;
		}),
	softDelete: protectedProcedure
		.input(
			z.object({
				taskId: z.string(),
			}),
		)
		.handler(async ({ context, input }) => {
			if (!context.session.session.activeOrganization?.id) {
				throw new ORPCError("NOT_FOUND", {
					message: "Organization not found",
				});
			}
			const taskId = await taskRepo.getIdByPublicId({ publicId: input.taskId });
			if (!taskId) {
				throw new ORPCError("NOT_FOUND", {
					message: "Task not found",
				});
			}
			const result = await taskRepo.softDelete({
				taskId: taskId?.id,
				deletedBy: context.session.user.id,
			});
			return result;
		}),
};
