import {
	IconCheck,
	IconChevronDown,
	IconLogout,
	IconPlus,
} from "@tabler/icons-react";

import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { authClient } from "@/lib/auth-client";
import { useModal } from "@/stores/modal.store";
import { queryClient } from "@/utils/orpc";

export function NavWorkspace({
	activeWorkspaceId,
}: {
	activeWorkspaceId?: string;
}) {
	const navigate = useNavigate();
	const { open } = useModal();
	const { data: workspaces, isPending: isWorkspacesPending } =
		authClient.useListOrganizations();
	const currentWorkspace = workspaces?.find((w) => w.id === activeWorkspaceId);

	const handleSwitchWorkspace = async (workspaceId: string) => {
		const workspace = workspaces?.find((w) => w.id === workspaceId);
		if (!workspace) return;

		await authClient.organization.setActive({
			organizationId: workspaceId,
		});
		queryClient.invalidateQueries();
		navigate({
			to: "/$slug/dashboard",
			params: { slug: workspace.slug as string },
		});
	};

	const handleLeave = async () => {
		if (!activeWorkspaceId) return;
		try {
			const { error } = await authClient.organization.leave({
				organizationId: activeWorkspaceId,
			});
			if (error) throw error;
			toast.success("Left organization successfully");
			navigate({ to: "/" });
		} catch (error) {
			const message =
				error instanceof Error ? error.message : "Failed to leave organization";
			toast.error(message);
		}
	};

	if (isWorkspacesPending) {
		return <Skeleton className="h-12 w-full" />;
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger>
				<SidebarMenuButton
					size="lg"
					className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
					render={<div />}
				>
					<Avatar>
						<AvatarImage
							src={currentWorkspace?.logo ?? ""}
							alt={currentWorkspace?.name ?? ""}
						/>
						<AvatarFallback>
							{currentWorkspace?.name?.charAt(0) ?? "W"}
						</AvatarFallback>
					</Avatar>
					<div className="grid flex-1 text-left text-sm leading-tight">
						<span className="truncate font-semibold">
							{currentWorkspace?.name ?? "Workspace"}
						</span>
						<span className="truncate text-xs">
							{currentWorkspace?.slug ?? "Select a workspace"}
						</span>
					</div>
					<IconChevronDown className="ml-auto size-4" />
				</SidebarMenuButton>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
				align="start"
				side={"bottom"}
				sideOffset={4}
			>
				<DropdownMenuGroup>
					<DropdownMenuSub>
						<DropdownMenuSubTrigger>
							<IconPlus className="size-4" />
							Switch workspace
						</DropdownMenuSubTrigger>
						<DropdownMenuSubContent className="w-48 rounded-lg">
							{workspaces?.map((org) => (
								<DropdownMenuItem
									key={org.id}
									onClick={() => handleSwitchWorkspace(org.id)}
									className="gap-2"
								>
									<Avatar>
										<AvatarImage src={org.logo ?? ""} alt={org.name ?? ""} />
										<AvatarFallback>
											{org.name?.charAt(0) ?? "W"}
										</AvatarFallback>
									</Avatar>
									{org.name}
									{org.id === currentWorkspace?.id && (
										<IconCheck className="ml-auto size-4" />
									)}
								</DropdownMenuItem>
							))}
							<DropdownMenuSeparator />
							<DropdownMenuItem
								onClick={() =>
									open({
										type: "NEW_WORKSPACE",
									})
								}
							>
								<div className="flex size-6 items-center justify-center rounded-md border bg-background">
									<IconPlus className="size-4" />
								</div>
								Create workspace
							</DropdownMenuItem>
						</DropdownMenuSubContent>
					</DropdownMenuSub>
					<DropdownMenuSeparator />
					<DropdownMenuItem
						className="text-destructive focus:bg-destructive focus:text-destructive-foreground"
						onClick={handleLeave}
					>
						<IconLogout className="mr-2 size-4" />
						Leave organization
					</DropdownMenuItem>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
