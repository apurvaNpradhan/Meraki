import {
	IconArrowLeft,
	IconSettings2,
	IconSettingsBolt,
	IconUsers,
} from "@tabler/icons-react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useLoaderData, useNavigate, useRouter } from "@tanstack/react-router";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenuButton,
} from "@/components/ui/sidebar";
import { useRouteActive } from "@/hooks/use-active-route";
import { sessionQueryOptions } from "@/lib/auth-client";

export function SettingSidebar({
	...props
}: React.ComponentProps<typeof Sidebar>) {
	const { workspace } = useLoaderData({ from: "/(authenicated)/$slug" });
	const { data: session } = useSuspenseQuery(sessionQueryOptions);
	const user = session?.data?.user;
	const isActive = useRouteActive();
	const router = useRouter();
	const onBack = () => {
		router.navigate({
			to: "/$slug/home",
			params: { slug: workspace.slug },
		});
	};
	const navigate = useNavigate();
	return (
		<Sidebar collapsible="offExamples" variant="inset" {...props}>
			<SidebarHeader className="px-0">
				<SidebarMenuButton
					onClick={() => {
						onBack();
					}}
				>
					<IconArrowLeft />
					<span>Back to app</span>
				</SidebarMenuButton>
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup className="p-0">
					<SidebarGroupLabel className="font-medium text-muted-foreground/80">
						Account
					</SidebarGroupLabel>
					<SidebarGroupContent className="flex flex-col gap-1">
						<SidebarMenuButton
							isActive={isActive(`${workspace.slug}/settings/account/profile`)}
							onClick={() =>
								navigate({
									to: "/$slug/settings/account/profile",
									params: { slug: workspace.slug },
								})
							}
						>
							<Avatar className="h-6 w-6 rounded-full border">
								<AvatarImage src={user?.image ?? ""} alt={user?.name} />
								<AvatarFallback className="rounded-full text-[10px]">
									{user?.name
										?.split(" ")
										.map((name) => name.charAt(0))
										.join("")}
								</AvatarFallback>
							</Avatar>
							<span className="font-medium">{user?.name}</span>
						</SidebarMenuButton>
						<SidebarMenuButton
							isActive={isActive(
								`${workspace.slug}/settings/account/preferences`,
							)}
							onClick={() =>
								navigate({
									to: "/$slug/settings/account/preferences",
									params: { slug: workspace.slug },
								})
							}
						>
							<IconSettings2 />
							Preferences
						</SidebarMenuButton>
					</SidebarGroupContent>
				</SidebarGroup>
				<SidebarGroup className="p-0">
					<SidebarGroupLabel className="font-medium text-muted-foreground/80">
						Workspace
					</SidebarGroupLabel>
					<SidebarGroupContent className="flex flex-col gap-1">
						<SidebarMenuButton
							isActive={isActive(`${workspace.slug}/settings/workspace`)}
							onClick={() =>
								navigate({
									to: "/$slug/settings/workspace/general",
									params: { slug: workspace.slug },
								})
							}
						>
							<IconSettingsBolt />
							General
						</SidebarMenuButton>
						<SidebarMenuButton
							isActive={isActive(`${workspace.slug}/settings/workspace/people`)}
							onClick={() =>
								navigate({
									to: "/$slug/settings/workspace/people",
									params: { slug: workspace.slug },
								})
							}
						>
							<IconUsers />
							People
						</SidebarMenuButton>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
		</Sidebar>
	);
}
