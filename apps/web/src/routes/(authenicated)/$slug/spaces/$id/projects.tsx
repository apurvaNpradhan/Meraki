import { createFileRoute } from "@tanstack/react-router";
import { Skeleton } from "@/components/ui/skeleton";
import { ProjectItemSkeleton } from "@/features/projects/components/project-item";
import { SpaceProjects } from "@/features/spaces/components/space-projects";

export const Route = createFileRoute(
	"/(authenicated)/$slug/spaces/$id/projects",
)({
	loader: async ({ context, params }) => {
		const { queryClient, orpc } = context;
		const projects = queryClient.ensureQueryData(
			orpc.project.allBySpaceId.queryOptions({
				input: { spacePublicId: params.id },
			}),
		);
		return {
			projects,
		};
	},
	component: () => {
		const { id } = Route.useParams();
		return <SpaceProjects id={id} />;
	},
	pendingComponent: () => (
		<div className="flex flex-col">
			{[1, 2, 3].map((i) => (
				<div key={i} className="flex flex-col">
					<div className="flex w-full items-center justify-between border-b p-2">
						<div className="flex items-center gap-2">
							<Skeleton className="h-6 w-6 rounded" />
							<Skeleton className="h-4 w-32" />
						</div>
					</div>
					<div className="flex flex-col">
						<ProjectItemSkeleton />
						<ProjectItemSkeleton />
					</div>
				</div>
			))}
		</div>
	),
});
