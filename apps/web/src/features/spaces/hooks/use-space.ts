import * as reactQuery from "@tanstack/react-query";
import { toast } from "sonner";
import { orpc } from "@/utils/orpc";

export type Space = {
	publicId: string;
	name: string;
	description: string | null;
	colorCode: string;
	icon: string;
};

export function useSpaces() {
	return reactQuery.useSuspenseQuery(orpc.space.all.queryOptions({}));
}

export function useSpaceOverview(spaceId: string) {
	return reactQuery.useSuspenseQuery(
		orpc.space.getOverview.queryOptions({ input: { spacePublicId: spaceId } }),
	);
}

export function useSpace(spaceId: string) {
	return useSpaceOverview(spaceId);
}

export function useCreateSpace() {
	const queryClient = reactQuery.useQueryClient();

	return reactQuery.useMutation(
		orpc.space.create.mutationOptions({
			onSuccess: (data) => {
				toast.success(`Space "${data?.name}" created successfully`);
				queryClient.invalidateQueries({
					queryKey: orpc.space.all.queryKey({}),
				});
			},
			onError: () => {
				toast.error("Failed to create space");
			},
		}),
	);
}

export function useUpdateSpace() {
	const queryClient = reactQuery.useQueryClient();

	return reactQuery.useMutation(
		orpc.space.update.mutationOptions({
			onMutate: async (variables) => {
				const allQueryKey = orpc.space.all.queryKey({});
				const overviewQueryKey = orpc.space.getOverview.queryKey({
					input: { spacePublicId: variables.spacePublicId },
				});

				await queryClient.cancelQueries({ queryKey: allQueryKey });
				await queryClient.cancelQueries({ queryKey: overviewQueryKey });

				const previousAll = queryClient.getQueryData(allQueryKey);
				const previousOverview = queryClient.getQueryData(overviewQueryKey);

				if (previousAll) {
					queryClient.setQueryData(allQueryKey, (old) => {
						if (!old) return old;
						return old.map((s) =>
							s.publicId === variables.spacePublicId
								? { ...s, ...variables.input }
								: s,
						);
					});
				}

				if (previousOverview) {
					queryClient.setQueryData(overviewQueryKey, (old) => {
						if (!old) return old;
						return { ...old, ...variables.input };
					});
				}

				return { previousAll, previousOverview };
			},
			onError: (_err, variables, context) => {
				if (context?.previousAll) {
					queryClient.setQueryData(
						orpc.space.all.queryKey({}),
						context.previousAll,
					);
				}
				if (context?.previousOverview) {
					queryClient.setQueryData(
						orpc.space.getOverview.queryKey({
							input: { spacePublicId: variables.spacePublicId },
						}),
						context.previousOverview,
					);
				}
				toast.error("Failed to update space");
			},
			onSettled: (_data, _error, variables) => {
				queryClient.invalidateQueries({
					queryKey: orpc.space.all.queryKey({}),
				});
				queryClient.invalidateQueries({
					queryKey: orpc.space.getOverview.queryKey({
						input: { spacePublicId: variables.spacePublicId },
					}),
				});
			},
		}),
	);
}

export function useDeleteSpace() {
	const queryClient = reactQuery.useQueryClient();

	return reactQuery.useMutation(
		orpc.space.delete.mutationOptions({
			onMutate: async (variables) => {
				const allQueryKey = orpc.space.all.queryKey({});
				await queryClient.cancelQueries({ queryKey: allQueryKey });
				const previousAll = queryClient.getQueryData(allQueryKey);

				if (previousAll) {
					queryClient.setQueryData(allQueryKey, (old) => {
						if (!old) return old;
						return old.filter((s) => s.publicId !== variables.spacePublicId);
					});
				}

				return { previousAll };
			},
			onSuccess: () => {
				toast.success("Space deleted successfully");
			},
			onError: (_err, _variables, context) => {
				if (context?.previousAll) {
					queryClient.setQueryData(
						orpc.space.all.queryKey({}),
						context.previousAll,
					);
				}
				toast.error("Failed to delete space");
			},
			onSettled: () => {
				queryClient.invalidateQueries({
					queryKey: orpc.space.all.queryKey({}),
				});
			},
		}),
	);
}
