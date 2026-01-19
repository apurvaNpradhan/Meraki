import { useLoaderData } from "@tanstack/react-router";
import { useState } from "react";
import {
	useProjectOverview,
	useProjectStatuses,
	useProjectTasks,
} from "@/features/projects/hooks/use-project";
import {
	type GroupBy,
	type SortBy,
	TaskList,
} from "@/features/tasks/components/task-list";
import { useModal } from "@/stores/modal.store";

export function ProjectTasks({ id }: { id: string }) {
	const { data: project } = useProjectOverview(id);
	const { data: tasks } = useProjectTasks(id);
	const { data: statuses } = useProjectStatuses(id);
	const { open } = useModal();
	const { workspace } = useLoaderData({ from: "/(authenicated)/$slug" });
	const [groupBy, _setGroupBy] = useState<GroupBy>("status");
	const [sortBy, _setSortBy] = useState<SortBy>("default");

	if (!project) return <div>Project not found</div>;

	return (
		<div className="flex w-full flex-col">
			{/* 			<div className="flex flex-col gap-2 p-4 pb-0">
				<div className="flex flex-row items-center gap-2">
					<ViewSettingsSelector
						groupBy={groupBy}
						onGroupByChange={setGroupBy}
						sortBy={sortBy}
						onSortByChange={setSortBy}
						showStatusGrouping={true}
					/>
					<Button
						size="sm"
						variant={"outline"}
						onClick={() =>
							open({
								type: "CREATE_TASK",
								modalSize: "lg",
								data: {
									projectPublicId: project.publicId,
									statuses: statuses,
								},
							})
						}
					>
						<IconPlus className="h-4 w-4" />
						<span>Add Task</span>
					</Button>
				</div>
			</div> */}

			<TaskList
				groupBy={groupBy}
				sortBy={sortBy}
				workspaceId={workspace.id}
				tasks={tasks}
				projectPublicId={project.publicId}
				statuses={statuses}
			/>
		</div>
	);
}
