import { IconHome, IconInbox } from "@tabler/icons-react";
import { useLoaderData, useNavigate } from "@tanstack/react-router";
import type React from "react";
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarHeader,
	SidebarMenuButton,
	SidebarTrigger,
	useSidebar,
} from "@/components/ui/sidebar";
import { useRouteActive } from "@/hooks/use-active-route";
import { NavSpaces } from "./nav-spaces";
import { NavWorkspace } from "./nav-workspace";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	const { workspace, session } = useLoaderData({
		from: "/(authenicated)/$slug",
	});

	const isActive = useRouteActive();
	const navigate = useNavigate();
	const sidebar = useSidebar();
	return (
		<Sidebar collapsible="icon" {...props} variant="inset">
			<SidebarHeader className="p-0">
				<div className="flex flex-row items-center gap-2">
					{session?.session.activeOrganization && (
						<NavWorkspace activeWorkspaceId={workspace.id} />
					)}
					{sidebar.state === "expanded" && <SidebarTrigger />}
				</div>
			</SidebarHeader>
			<SidebarContent className="mt-5 flex flex-col gap-5 text-muted-foreground">
				<SidebarGroup className="p-0">
					<SidebarGroupContent className="flex flex-col gap-1">
						<SidebarMenuButton
							size={"sm"}
							className="text-md"
							isActive={isActive(`${workspace.slug}/inbox`)}
							onClick={() =>
								navigate({
									to: "/$slug/inbox",
									params: {
										slug: workspace.slug,
									},
								})
							}
						>
							<IconInbox />
							Inbox
						</SidebarMenuButton>
						<SidebarMenuButton
							size={"sm"}
							className="text-md"
							isActive={isActive(`${workspace.slug}/home`)}
							onClick={() =>
								navigate({
									to: "/$slug/home",
									params: {
										slug: workspace.slug,
									},
								})
							}
						>
							<IconHome />
							Home
						</SidebarMenuButton>
					</SidebarGroupContent>
				</SidebarGroup>
				<NavSpaces />
			</SidebarContent>
		</Sidebar>
	);
}
