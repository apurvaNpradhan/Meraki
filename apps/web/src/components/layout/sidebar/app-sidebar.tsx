import { IconDashboard } from "@tabler/icons-react";
import { useParams, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import type React from "react";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouteActive } from "@/hooks/use-active-route";
import { authClient, sessionQueryOptions } from "@/lib/auth-client";
import { NavUser } from "./nav-user";
import { NavWorkspace } from "./nav-workspace";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	const { data,isPending } = useQuery({
		...sessionQueryOptions,
	});
	
	const isActive = useRouteActive();
	const navigate = useNavigate();

	return (
		<Sidebar collapsible="icon" {...props} variant="inset">
			<SidebarHeader className="p-0">
				{isPending ? (
					<Skeleton className="h-12 w-full" />
				) : data?.data?.session?.activeOrganizationId && (
					<NavWorkspace activeOrganizationId={data?.data?.session?.activeOrganizationId} />
				)}
			</SidebarHeader>
			<SidebarContent className="mt-5 flex flex-col gap-5 text-muted-foreground">
				<SidebarGroup className="p-0">
					<SidebarGroupContent className="flex flex-col gap-1">
						<SidebarMenuButton
							size={"sm"}
							isActive={isActive("/dashboard")}
							onClick={() => navigate({ to: "/dashboard" })}>
						
							<IconDashboard />
							Dashboard
						</SidebarMenuButton>
					</SidebarGroupContent>
				</SidebarGroup>
				<SidebarGroup>
					<SidebarGroupLabel>Workspace</SidebarGroupLabel>
									</SidebarGroup>
			</SidebarContent>
			<SidebarFooter className="flex items-center" >
								{!data?.data?.user ? (
					<Skeleton className="h-12 w-full" />
				) : (
					<NavUser user={data?.data?.user} />
				)}

			</SidebarFooter>
		</Sidebar>
	);
}
