import * as reactQuery from "@tanstack/react-query";
import { useNavigate, useParams } from "@tanstack/react-router";
import { toast } from "sonner";
import { orpc } from "@/utils/orpc";

export function useProjects() {
	return reactQuery.useInfiniteQuery(
		orpc.project.list.infiniteOptions({
			input: (pageParam) => ({
				limit: 20,
				cursor: pageParam as string | undefined,
			}),
			getNextPageParam: (lastPage) => lastPage.nextCursor,
			initialPageParam: undefined as string | undefined,
		}),
	);
}
export function useProjectsBySpaceId(spacePublicId: string) {
	return reactQuery.useSuspenseQuery(
		orpc.project.allBySpaceId.queryOptions({
			input: {
				spacePublicId,
			},
		}),
	);
}

export function useProject(projectPublicId: string) {
	return reactQuery.useSuspenseQuery(
		orpc.project.getOverview.queryOptions({
			input: {
				projectPublicId,
			},
		}),
	);
}

export const useProjectOverview = useProject;

export function useProjectTasks(publicId: string) {
	return reactQuery.useSuspenseQuery(
		orpc.task.allByProjectId.queryOptions({
			input: {
				projectPublicId: publicId,
			},
		}),
	);
}

export function useProjectStatuses(publicId: string) {
	const { data } = useProjectOverview(publicId);
	return { data: data.statuses };
}

export function useUpdateProject({
	spacePublicId,
}: {
	spacePublicId?: string;
} = {}) {
	const queryClient = reactQuery.useQueryClient();

	return reactQuery.useMutation(
		orpc.project.update.mutationOptions({
			onSettled: (_data, _error, variables) => {
				//Invalidate queries
				queryClient.invalidateQueries({
					queryKey: orpc.project.list.queryKey({ input: { limit: 20 } }),
				});
				queryClient.invalidateQueries({
					queryKey: orpc.project.getOverview.queryKey({
						input: { projectPublicId: variables.projectPublicId },
					}),
				});
				if (spacePublicId) {
					queryClient.invalidateQueries({
						queryKey: orpc.project.allBySpaceId.queryKey({
							input: { spacePublicId },
						}),
					});
				}
			},
			onMutate: async (variables) => {
				const overviewQueryKey = orpc.project.getOverview.queryKey({
					input: {
						projectPublicId: variables.projectPublicId,
					},
				});

				let spaceQueryKey = null;
				if (spacePublicId) {
					spaceQueryKey = orpc.project.allBySpaceId.queryKey({
						input: {
							spacePublicId,
						},
					});
				}

				await queryClient.cancelQueries({
					queryKey: overviewQueryKey,
				});

				if (spaceQueryKey) {
					await queryClient.cancelQueries({
						queryKey: spaceQueryKey,
					});
				}

				const previousOverview = queryClient.getQueryData(overviewQueryKey);
				if (previousOverview) {
					queryClient.setQueryData(overviewQueryKey, (old) => {
						if (!old) return old;
						return {
							...old,
							...variables,
							...(variables.projectStatusPublicId && {
								projectStatus: {
									publicId: variables.projectStatusPublicId ?? "",
									name: "",
									colorCode: "",
									icon: "",
									type: "backlog",
								},
							}),
						};
					});
				}

				const previousSpace = spaceQueryKey
					? queryClient.getQueryData(spaceQueryKey)
					: null;
				if (previousSpace && spaceQueryKey) {
					queryClient.setQueryData(spaceQueryKey, (old) => {
						if (!old) return old;
						return old.map((p) =>
							p.publicId === variables.projectPublicId
								? {
										...p,
										...variables,
										...(variables.projectStatusPublicId && {
											projectStatus: {
												publicId: variables.projectStatusPublicId ?? "",
												name: "",
											},
										}),
									}
								: p,
						);
					});
				}

				return { previousOverview, previousSpace };
			},
			onError: (_err, _variables, context) => {
				if (context?.previousOverview) {
					queryClient.setQueryData(
						orpc.project.getOverview.queryKey({
							input: { projectPublicId: _variables.projectPublicId },
						}),
						context.previousOverview,
					);
				}
				if (context?.previousSpace && spacePublicId) {
					queryClient.setQueryData(
						orpc.project.allBySpaceId.queryKey({
							input: { spacePublicId },
						}),
						context.previousSpace,
					);
				}
				toast.error("Failed to update project");
			},
		}),
	);
}

export function useDeleteProject({
	spacePublicId,
}: {
	spacePublicId?: string;
} = {}) {
	const queryClient = reactQuery.useQueryClient();

	return reactQuery.useMutation(
		orpc.project.delete.mutationOptions({
			onMutate: async (variables) => {
				let spaceProjectsQueryKey = null;

				if (spacePublicId) {
					spaceProjectsQueryKey = orpc.project.allBySpaceId.queryKey({
						input: { spacePublicId },
					});
					await queryClient.cancelQueries({ queryKey: spaceProjectsQueryKey });
				}

				const previousSpaceProjects = spaceProjectsQueryKey
					? queryClient.getQueryData(spaceProjectsQueryKey)
					: null;

				if (spaceProjectsQueryKey && previousSpaceProjects) {
					queryClient.setQueryData(spaceProjectsQueryKey, (old) => {
						if (!old) return old;
						return old.filter((p) => p.publicId !== variables.projectPublicId);
					});
				}

				return { previousSpaceProjects };
			},
			onSuccess: () => {
				toast.success("Project deleted successfully", {
					action: {
						label: "Undo",
						onClick: () => {},
					},
				});
			},
			onError: (err, _variables, context) => {
				if (context?.previousSpaceProjects && spacePublicId) {
					queryClient.setQueryData(
						orpc.project.allBySpaceId.queryKey({
							input: { spacePublicId },
						}),
						context.previousSpaceProjects,
					);
				}
				toast.error(err.message || "Failed to delete project");
			},
			onSettled: (_data, _error, _variables) => {
				queryClient.invalidateQueries({
					queryKey: orpc.project.list.queryKey({ input: { limit: 20 } }),
				});
				if (spacePublicId) {
					queryClient.invalidateQueries({
						queryKey: orpc.project.allBySpaceId.queryKey({
							input: { spacePublicId },
						}),
					});
				}
			},
		}),
	);
}

export function useCreateProject({ spacePublicId }: { spacePublicId: string }) {
	const navigate = useNavigate();
	const { slug } = useParams({ strict: false });
	const queryClient = reactQuery.useQueryClient();

	return reactQuery.useMutation(
		orpc.project.create.mutationOptions({
			onSuccess: (data) => {
				queryClient.invalidateQueries({
					queryKey: orpc.project.list.queryKey({ input: { limit: 20 } }),
				});
				queryClient.invalidateQueries({
					queryKey: orpc.project.allBySpaceId.queryKey({
						input: {
							spacePublicId,
						},
					}),
				});
				toast.success("Project created successfully", {
					description: data.name,
					action: {
						label: "Go to project",
						onClick: () => {
							navigate({
								to: "/$slug/projects/$id",
								params: {
									slug: slug ?? "",
									id: data.publicId,
								},
							});
						},
					},
				});
			},
			onError: (err) => {
				toast.error(err.message || "Failed to create project");
			},
		}),
	);
}
