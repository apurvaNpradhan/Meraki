import * as reactQuery from "@tanstack/react-query";
import { orpc } from "@/utils/orpc";

export function useTasks() {
	return reactQuery.useQuery(orpc.task.all.queryOptions({}));
}

export function useCreateTask() {
	return reactQuery.useMutation(orpc.task.create.mutationOptions({}));
}

export function useUpdateTask() {
	return reactQuery.useMutation(orpc.task.update.mutationOptions({}));
}
