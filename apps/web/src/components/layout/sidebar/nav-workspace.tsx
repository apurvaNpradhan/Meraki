import {
	IconCheck,
	IconChevronDown,
	IconLogout,
	IconPlus,
	IconSettings,
} from "@tabler/icons-react";
import { useNavigate } from "@tanstack/react-router";
import { UserPlus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuSeparator,
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

	const handleSwitchWorkspace = (workspaceId: string) => {
		const workspace = workspaces?.find((w) => w.id === workspaceId);
		if (!workspace) return;

		authClient.organization.setActive({
			organizationId: workspaceId,
		});
		queryClient.setQueryData(["session"], (oldData: any) => {
			if (!oldData) return oldData;
			return {
				...oldData,
				data: {
					...oldData.data,
					session: {
						...oldData.data.session,
						activeOrganization: workspace,
					},
				},
			};
		});
		navigate({
			to: "/$slug/home",
			params: { slug: workspace.slug as string },
		});
	};

	const handleLogout = async () => {
		await authClient.signOut({
			fetchOptions: {
				onSuccess: () => {
					navigate({
						to: "/",
					});
					queryClient.invalidateQueries();
				},
			},
		});
	};

	if (isWorkspacesPending) {
		return <Skeleton className="h-12 w-full" />;
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				nativeButton={true}
				render={
					<SidebarMenuButton
						size="lg"
						className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
					>
						<Avatar className="h-8 w-8">
							<AvatarImage
								className={"rounded-md"}
								src={currentWorkspace?.logo ?? ""}
								alt={currentWorkspace?.name ?? ""}
							/>
							<AvatarFallback className="rounded-md">
								{currentWorkspace?.name?.charAt(0) ?? "W"}
							</AvatarFallback>
						</Avatar>
						<div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
							<span className="truncate font-semibold">
								{currentWorkspace?.name ?? "Workspace"}
							</span>
						</div>
						<IconChevronDown className="ml-auto size-4 group-data-[collapsible=icon]:hidden" />
					</SidebarMenuButton>
				}
			/>
			<DropdownMenuContent
				className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
				align="start"
				side={"bottom"}
				sideOffset={4}
			>
				<div className="flex items-center gap-2 p-2">
					<div className="flex size-8 items-center justify-center rounded-md border">
						<Avatar className="h-8 w-8">
							<AvatarImage
								src={currentWorkspace?.logo ?? ""}
								alt={currentWorkspace?.name ?? ""}
								className={"rounded-md"}
							/>
							<AvatarFallback className="rounded-md">
								{currentWorkspace?.name?.charAt(0) ?? "W"}
							</AvatarFallback>
						</Avatar>
					</div>
					<div className="grid flex-1 text-left text-sm leading-tight">
						<span className="truncate font-semibold">
							{currentWorkspace?.name}
						</span>
						<span className="truncate text-muted-foreground text-xs">
							{(currentWorkspace as any)?.members?.length ?? 1} members
						</span>
					</div>
				</div>

				<div className="flex items-center justify-between gap-1 p-2">
					<DropdownMenuItem
						onClick={() =>
							navigate({
								to: "/$slug/settings/account/profile",
								params: { slug: currentWorkspace?.slug ?? "" },
							})
						}
						className="gap-2"
						render={<Button variant={"outline"} size={"sm"} />}
						nativeButton={true}
					>
						<IconSettings className="size-4 text-muted-foreground" />
						Settings
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={() =>
							navigate({
								to: "/$slug/settings/account/profile",
								params: { slug: currentWorkspace?.slug ?? "" },
							})
						}
						className="gap-2"
						render={<Button variant={"outline"} size={"sm"} />}
						nativeButton={true}
					>
						<UserPlus className="size-4 font-medium text-muted-foreground" />
						Invite members
					</DropdownMenuItem>
				</div>

				<DropdownMenuSeparator />

				<DropdownMenuGroup>
					<div className="px-2 py-1.5 font-medium text-muted-foreground text-xs">
						Switch workspace
					</div>
					{workspaces?.map((org) => (
						<DropdownMenuItem
							key={org.id}
							onClick={() => handleSwitchWorkspace(org.id)}
							className="gap-2"
						>
							<Avatar className="size-6 rounded-md">
								<AvatarImage
									src={org.logo ?? ""}
									alt={org.name ?? ""}
									className="rounded-md"
								/>
								<AvatarFallback className="rounded-md">
									{org.name?.charAt(0) ?? "W"}
								</AvatarFallback>
							</Avatar>
							{org.name}
							{org.id === currentWorkspace?.id && (
								<IconCheck className="ml-auto size-4" />
							)}
						</DropdownMenuItem>
					))}
					<DropdownMenuItem
						onClick={() =>
							open({
								type: "NEW_WORKSPACE",
							})
						}
						className="gap-2"
					>
						<div className="flex size-6 items-center justify-center rounded-md border bg-background">
							<IconPlus className="size-4" />
						</div>
						<span className="font-medium text-muted-foreground">
							New workspace
						</span>
					</DropdownMenuItem>
				</DropdownMenuGroup>

				<DropdownMenuSeparator />

				<DropdownMenuGroup>
					<DropdownMenuItem
						className="gap-2 text-destructive focus:bg-destructive focus:text-destructive-foreground"
						onClick={handleLogout}
					>
						<IconLogout className="size-4" />
						Log out
					</DropdownMenuItem>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
