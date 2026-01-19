import { IconAlertTriangle, IconLoader2 } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import {
	ResponsiveModalDescription,
	ResponsiveModalFooter,
	ResponsiveModalHeader,
	ResponsiveModalTitle,
} from "@/components/ui/responsive-modal";
import { useModal } from "@/stores/modal.store";
import { useDeleteProject } from "../hooks/use-project";

export function DeleteProjectModal({
	project,
}: {
	project: { publicId: string; name: string; spacePublicId: string };
}) {
	const { close } = useModal();
	const deleteProject = useDeleteProject({
		spacePublicId: project.spacePublicId,
	});

	const handleDelete = () => {
		deleteProject.mutate(
			{ projectPublicId: project.publicId },
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
					<ResponsiveModalTitle>Delete Project</ResponsiveModalTitle>
				</div>
				<ResponsiveModalDescription>
					Are you sure you want to delete{" "}
					<span className="font-semibold">{project.name}</span>? This action
					will move the project to trash.
				</ResponsiveModalDescription>
			</ResponsiveModalHeader>

			<ResponsiveModalFooter className="mt-2 flex flex-col gap-2 sm:flex-row sm:justify-end">
				<Button
					type="button"
					variant="ghost"
					onClick={close}
					disabled={deleteProject.isPending}
				>
					Cancel
				</Button>
				<Button
					type="button"
					variant="destructive"
					onClick={handleDelete}
					disabled={deleteProject.isPending}
				>
					{deleteProject.isPending ? (
						<>
							<IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
							Deleting...
						</>
					) : (
						"Delete Project"
					)}
				</Button>
			</ResponsiveModalFooter>
		</div>
	);
}
