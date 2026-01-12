import { IconLogout, IconSettings } from "@tabler/icons-react";
import { useNavigate } from "@tanstack/react-router";
import type { User } from "better-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth-client";
import { queryClient } from "@/utils/orpc";

export function NavUser({ user }: { user: User }) {
	const navigate = useNavigate();
	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				render={
					<SidebarMenuButton
						size="lg"
						className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
					/>
				}
			>
				<Avatar className="h-8 w-8 rounded-full border">
					<AvatarImage src={user.image ?? ""} alt={user.name} />
					<AvatarFallback className="rounded-full">
						{user.name
							.split(" ")
							.map((name) => name.charAt(0))
							.join("")}
					</AvatarFallback>
				</Avatar>
				<div className="grid flex-1 text-left text-sm leading-tight">
					<span className="truncate font-medium">{user.name}</span>
				</div>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
				align="end"
				alignOffset={-10}
				sideOffset={4}
			>
				<DropdownMenuItem className="gap-2 p-2 font-medium">
					<div className="flex size-6 items-center justify-center rounded-sm border">
						<Avatar className="h-6 w-6 rounded-sm">
							<AvatarImage src={user.image ?? ""} alt={user.name} />
							<AvatarFallback className="rounded-sm">
								{user.name
									.split(" ")
									.map((name) => name.charAt(0))
									.join("")}
							</AvatarFallback>
						</Avatar>
					</div>
					<div className="flex flex-col gap-0.5">
						<span className="font-semibold text-sm">{user.name}</span>
						<span className="text-muted-foreground text-xs">{user.email}</span>
					</div>
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuItem
						onClick={() => navigate({ to: "/settings/account/profile" })}
					>
						<IconSettings className="size-4 text-muted-foreground" />
						Settings
					</DropdownMenuItem>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuItem
					variant="destructive"
					onClick={() => {
						authClient.signOut({
							fetchOptions: {
								onSuccess: () => {
									navigate({
										to: "/",
									});
									queryClient.invalidateQueries();
								},
							},
						});
					}}
				>
					<IconLogout className="size-4" />
					Log out
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
