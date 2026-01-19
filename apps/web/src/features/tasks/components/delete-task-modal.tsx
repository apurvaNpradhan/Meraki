import { IconAlertTriangle, IconLoader2 } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import {
	ResponsiveModalDescription,
	ResponsiveModalFooter,
	ResponsiveModalHeader,
	ResponsiveModalTitle,
} from "@/components/ui/responsive-modal";
import { useModal } from "@/stores/modal.store";
import { useDeleteTask } from "../hooks/use-tasks";

export function DeleteTaskModal({
	task,
	projectPublicId,
}: {
	task: { publicId: string; title: string };
	projectPublicId?: string;
}) {
	const { close } = useModal();
	const deleteTask = useDeleteTask({ projectPublicId });

	const handleDelete = () => {
		deleteTask.mutate(
			{ taskId: task.publicId },
			{
				onSuccess: () => {
					close();
				},
			},
		);
	};

	return (
		<div className="flex flex-col gap-6 p-1">
			<ResponsiveModalHeader>
				<div className="flex items-center gap-2 text-destructive">
					<IconAlertTriangle size={24} />
					<ResponsiveModalTitle>Delete Task</ResponsiveModalTitle>
				</div>
				<ResponsiveModalDescription>
					Are you sure you want to delete{" "}
					<span className="font-semibold">{task.title}</span>? This action will
					move the task to trash.
				</ResponsiveModalDescription>
			</ResponsiveModalHeader>

			<ResponsiveModalFooter className="mt-2 flex flex-col gap-2 sm:flex-row sm:justify-end">
				<Button
					type="button"
					variant="ghost"
					onClick={close}
					disabled={deleteTask.isPending}
				>
					Cancel
				</Button>
				<Button
					type="button"
					variant="destructive"
					onClick={handleDelete}
					disabled={deleteTask.isPending}
				>
					{deleteTask.isPending ? (
						<>
							<IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
							Deleting...
						</>
					) : (
						"Delete Task"
					)}
				</Button>
			</ResponsiveModalFooter>
		</div>
	);
}
