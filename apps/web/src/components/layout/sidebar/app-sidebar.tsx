import { IconLayoutKanban } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import type React from "react";
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarHeader,
	SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouteActive } from "@/hooks/use-active-route";
import { sessionQueryOptions } from "@/lib/auth-client";

import { NavWorkspace } from "./nav-workspace";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	const { data, isPending } = useQuery({
		...sessionQueryOptions,
	});

	const isActive = useRouteActive();
	const navigate = useNavigate();
	console.log(
		isActive(`${data?.data?.session?.activeOrganization?.slug}/dashboard`),
	);
	return (
		<Sidebar collapsible="icon" {...props} variant="inset">
			<SidebarHeader className="p-0">
				{isPending ? (
					<Skeleton className="h-12 w-full" />
				) : (
					data?.data?.session?.activeOrganization && (
						<NavWorkspace
							activeWorkspaceId={data?.data?.session?.activeOrganization.id}
						/>
					)
				)}
			</SidebarHeader>
			<SidebarContent className="mt-5 flex flex-col gap-5 text-muted-foreground">
				<SidebarGroup className="p-0">
					<SidebarGroupContent className="flex flex-col gap-1">
						<SidebarMenuButton
							size={"sm"}
							isActive={isActive(
								`${data?.data?.session?.activeOrganization?.slug}/dashboard`,
							)}
							onClick={() =>
								navigate({
									to: "/$slug/dashboard",
									params: {
										slug: data?.data?.session?.activeOrganization?.slug ?? "",
									},
								})
							}
						>
							<IconLayoutKanban />
							Dashboard
						</SidebarMenuButton>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
		</Sidebar>
	);
}
