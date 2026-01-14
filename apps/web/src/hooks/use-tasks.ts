import type { InsertTaskType, UpdateTaskType } from "@meraki/api/types/task";
import * as reactQuery from "@tanstack/react-query";
import { toast } from "sonner";
import { orpc } from "@/utils/orpc";

export function useTasks() {
	return reactQuery.useQuery(orpc.task.all.queryOptions({}));
}

export function useCreateTask({
	workspaceId: _workspaceId,
}: {
	workspaceId: string;
}) {
	const queryClient = reactQuery.useQueryClient();

	return reactQuery.useMutation(
		orpc.task.create.mutationOptions({
			onMutate: async (variables: {
				input: InsertTaskType;
				workspaceId: string;
			}) => {
				const queryKey = orpc.task.all.queryKey({});
				await queryClient.cancelQueries({ queryKey });

				const previousTasks = queryClient.getQueryData(queryKey);

				queryClient.setQueryData(queryKey, (old: any[] | undefined) => {
					const optimisticTask = {
						publicId: crypto.randomUUID(),
						title: variables.input.title,
						description: variables.input.description,
						status: variables.input.status ?? "todo",
						priority: variables.input.priority ?? 0,
						position: variables.input.position ?? "0",
						createdAt: new Date(),
						updatedAt: new Date(),
					};
					return old ? [...old, optimisticTask] : [optimisticTask];
				});

				return { previousTasks };
			},
			onError: (_err, _variables, context) => {
				queryClient.setQueryData(
					orpc.task.all.queryKey({}),
					context?.previousTasks,
				);
				toast.error("Failed to create task");
			},
			onSettled: () => {
				queryClient.invalidateQueries({
					queryKey: orpc.task.all.queryKey({}),
				});
			},
			onSuccess: () => {
				toast.success("Task created successfully");
			},
		}),
	);
}

export function useUpdateTask({
	workspaceId: _workspaceId,
}: {
	workspaceId: string;
}) {
	const queryClient = reactQuery.useQueryClient();

	return reactQuery.useMutation(
		orpc.task.update.mutationOptions({
			onMutate: async (variables: {
				input: UpdateTaskType;
				taskId: string;
				workspaceId: string;
			}) => {
				const queryKey = orpc.task.all.queryKey({});
				await queryClient.cancelQueries({ queryKey });

				const previousTasks = queryClient.getQueryData(queryKey);

				queryClient.setQueryData(queryKey, (old: any[] | undefined) => {
					if (!old) return old;
					return old.map((task: any) =>
						task.publicId === variables.taskId
							? { ...task, ...variables.input }
							: task,
					);
				});

				return { previousTasks };
			},
			onError: (_err, _variables, context) => {
				queryClient.setQueryData(
					orpc.task.all.queryKey({}),
					context?.previousTasks,
				);
				toast.error("Failed to update task");
			},
			onSettled: () => {
				queryClient.invalidateQueries({
					queryKey: orpc.task.all.queryKey({}),
				});
			},
		}),
	);
}
