import * as taskRepo from "@meraki/db/repository/task.repo";
import { ORPCError } from "@orpc/client";
import z from "zod";
import { protectedProcedure } from "..";
import { InsertTaskInput, UpdateTaskInput } from "../types/task";

export const TaskRouter = {
	all: protectedProcedure.handler(async ({ context, input }) => {
		const result = await taskRepo.getAllByWorkspaceId({
			workspaceId: context.session.session.activeOrganization?.id,
		});
		return result;
	}),
	create: protectedProcedure
		.input(
			z.object({
				input: InsertTaskInput,
				workspaceId: z.string(),
			}),
		)
		.handler(async ({ context, input }) => {
			const result = await taskRepo.create({
				input: {
					...input.input,
					assigneeId: context.session.user.id,
					organizationId: context.session.session.activeOrganization?.id,
					createdBy: context.session.user.id,
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
			const taskId = await taskRepo.getIdByPublicId({ publicId: input.taskId });
			if (!taskId) {
				throw new ORPCError("NOT_FOUND", {
					message: "Task not found",
				});
			}
			const result = await taskRepo.update({
				input: {
					...input.input,
				},
				taskId: taskId?.id,
			});
			return result;
		}),
};
