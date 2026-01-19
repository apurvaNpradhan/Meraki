import { createFileRoute } from "@tanstack/react-router";
import { Skeleton } from "@/components/ui/skeleton";
import { ProjectTasks } from "@/features/projects/components/project-tasks";
import { TaskListItemSkeleton } from "@/features/tasks/components/task-list";

export const Route = createFileRoute(
	"/(authenicated)/$slug/projects/$id/tasks",
)({
	loader: async ({ context, params }) => {
		const { queryClient, orpc } = context;
		const tasks = queryClient.ensureQueryData(
			orpc.task.allByProjectId.queryOptions({
				input: { projectPublicId: params.id },
			}),
		);
		return Promise.all([tasks]);
	},
	component: () => {
		const { id } = Route.useParams();
		return <ProjectTasks id={id} />;
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
						<TaskListItemSkeleton />
						<TaskListItemSkeleton />
						<TaskListItemSkeleton />
					</div>
				</div>
			))}
		</div>
	),
});
