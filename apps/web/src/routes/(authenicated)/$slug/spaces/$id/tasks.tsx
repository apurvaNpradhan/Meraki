import { createFileRoute } from "@tanstack/react-router";
import { Skeleton } from "@/components/ui/skeleton";

import { TaskListItemSkeleton } from "@/features/tasks/components/task-list";

export const Route = createFileRoute("/(authenicated)/$slug/spaces/$id/tasks")({
	component: () => <div>Tasks view placeholder</div>,
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
