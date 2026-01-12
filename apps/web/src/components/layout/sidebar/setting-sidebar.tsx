import { IconArrowLeft, IconSettings2 } from "@tabler/icons-react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useNavigate, useRouter } from "@tanstack/react-router";
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
	const { data: session } = useSuspenseQuery(sessionQueryOptions);
	const user = session?.data?.user;
	const isActive = useRouteActive();
	const router = useRouter();
	const onBack = () => {
		router.navigate({ to: "/dashboard" });
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
							isActive={isActive("/settings/account/profile")}
							onClick={() =>
								navigate({
									to: "/settings/account/profile",
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
							isActive={isActive("/settings/account/preferences")}
							onClick={() =>
								navigate({
									to: "/settings/account/preferences",
								})
							}
						>
							<IconSettings2 />
							Preferences
						</SidebarMenuButton>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
		</Sidebar>
	);
}
