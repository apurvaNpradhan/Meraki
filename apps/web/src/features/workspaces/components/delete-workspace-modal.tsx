import { zodResolver } from "@hookform/resolvers/zod";
import { IconAlertTriangle, IconLoader2 } from "@tabler/icons-react";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	ResponsiveModalDescription,
	ResponsiveModalFooter,
	ResponsiveModalHeader,
	ResponsiveModalTitle,
} from "@/components/ui/responsive-modal";
import { authClient } from "@/lib/auth-client";
import { useModal } from "@/stores/modal.store";
import { queryClient } from "@/utils/orpc";

export function DeleteWorkspaceModal({
	workspace,
}: {
	workspace: { id: string; name: string };
}) {
	const { close } = useModal();
	const [isLoading, setIsLoading] = useState(false);
	const navigate = useNavigate();

	const deleteSchema = z.object({
		name: z.string().refine((val) => val === workspace.name, {
			message: "Workspace name doesn't match",
		}),
	});

	type DeleteFormValues = z.infer<typeof deleteSchema>;

	const form = useForm<DeleteFormValues>({
		resolver: zodResolver(deleteSchema),
		defaultValues: {
			name: "",
		},
	});

	async function onSubmit() {
		setIsLoading(true);
		try {
			const { error } = await authClient.organization.delete({
				organizationId: workspace.id,
			});

			if (error) {
				throw error;
			}

			queryClient.invalidateQueries();
			toast.success("Workspace deleted successfully");
			close();
			navigate({ to: "/" });
		} catch (error) {
			const message =
				error instanceof Error ? error.message : "Failed to delete workspace";
			toast.error(message);
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<div className="flex flex-col gap-6 p-1">
			<ResponsiveModalHeader>
				<div className="flex items-center gap-2 text-destructive">
					<IconAlertTriangle size={24} />
					<ResponsiveModalTitle>Delete Workspace</ResponsiveModalTitle>
				</div>
				<ResponsiveModalDescription>
					This action is permanent and cannot be undone. All data in this
					workspace will be permanently removed.
				</ResponsiveModalDescription>
			</ResponsiveModalHeader>

			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="flex flex-col gap-4"
			>
				<div className="flex flex-col gap-2">
					<label
						htmlFor="deleteConfirmName"
						className="font-medium text-foreground/80 text-sm"
					>
						Please type in the workspace name to confirm:{" "}
						<span className="font-semibold text-foreground">
							{workspace.name}
						</span>
					</label>
					<Input
						id="deleteConfirmName"
						placeholder={workspace.name}
						{...form.register("name")}
						className={
							form.formState.errors.name
								? "border-destructive focus-visible:ring-destructive/20"
								: ""
						}
					/>
					{form.formState.errors.name && (
						<p className="text-destructive text-xs">
							{form.formState.errors.name.message}
						</p>
					)}
				</div>

				<ResponsiveModalFooter className="mt-2 flex flex-col gap-2 sm:flex-col">
					<Button
						type="submit"
						variant="destructive"
						className="w-full"
						disabled={isLoading || !form.formState.isValid}
					>
						{isLoading ? (
							<>
								<IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
								Processing...
							</>
						) : (
							"Permanently delete workspace"
						)}
					</Button>
					<Button
						type="button"
						variant="ghost"
						onClick={close}
						disabled={isLoading}
						className="w-full"
					>
						Cancel
					</Button>
				</ResponsiveModalFooter>
			</form>
		</div>
	);
}
