import { createFileRoute } from "@tanstack/react-router";
import { Skeleton } from "@/components/ui/skeleton";
import { ProjectOverview } from "@/features/projects/components/project-overview";

export const Route = createFileRoute(
	"/(authenicated)/$slug/projects/$id/overview",
)({
	loader: async ({ context, params }) => {
		const { queryClient, orpc } = context;
		await queryClient.ensureQueryData(
			orpc.project.getOverview.queryOptions({
				input: { projectPublicId: params.id },
			}),
		);
	},
	component: () => {
		const { id } = Route.useParams();
		return <ProjectOverview id={id} />;
	},
	pendingComponent: () => (
		<div className="container flex flex-col gap-4">
			<div className="mt-10 flex flex-row items-center gap-4">
				<Skeleton className="h-12 w-12 rounded-lg" />
				<Skeleton className="h-10 w-64" />
			</div>
			<div className="mt-5 flex flex-col gap-2">
				<Skeleton className="h-4 w-full" />
				<Skeleton className="h-4 w-[90%]" />
				<Skeleton className="h-4 w-[85%]" />
			</div>
		</div>
	),
});
