import { useQuery } from "@tanstack/react-query";
import ContentEditor from "@/components/editor/editors/content-editor";
import { useModal } from "@/stores/modal.store";
import { orpc } from "@/utils/orpc";

export function TaskDetailModal({ taskId }: { taskId: string }) {
	const { close } = useModal();
	const { data: task, isLoading } = useQuery(
		orpc.task.byId.queryOptions({ input: { taskId } }),
	);

	if (isLoading) {
		return <div className="p-8 text-center">Loading task details...</div>;
	}

	if (!task) {
		return (
			<div className="p-8 text-center text-muted-foreground">
				Task not found.
			</div>
		);
	}

	return (
		<div className="p-6">
			<h2 className="font-bold text-2xl">{task.title}</h2>
			<div className="mt-4">
				<ContentEditor
					initialContent={task.description ?? undefined}
					placeholder="Task description..."
					className="text-primary/70"
				/>
			</div>
			<div className="mt-6 flex justify-end">
				<button
					type="button"
					onClick={close}
					className="rounded-md bg-primary px-4 py-2 text-primary-foreground"
				>
					Close
				</button>
			</div>
		</div>
	);
}
