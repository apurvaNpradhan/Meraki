import { env } from "@meraki/env/web";
import { IconCamera, IconChevronRight, IconLoader2 } from "@tabler/icons-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
	Item,
	ItemActions,
	ItemContent,
	ItemDescription,
	ItemGroup,
	ItemTitle,
} from "@/components/ui/item";
import { Separator } from "@/components/ui/separator";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { useModal } from "@/stores/modal.store";
import { orpc, queryClient } from "@/utils/orpc";

export function WorkspaceGeneralSettings({
	workspace: initialWorkspace,
}: {
	workspace: { id: string; name: string; slug: string; logo?: string | null };
}) {
	const { open } = useModal();
	const navigate = useNavigate();

	const { data: workspaceData } = useQuery({
		queryKey: ["workspace", initialWorkspace.id],
		queryFn: async () => {
			const { data, error } = await authClient.organization.getFullOrganization(
				{
					query: {
						organizationId: initialWorkspace.id,
					},
				},
			);
			if (error) throw error;
			return data;
		},
	});

	const workspace = workspaceData || initialWorkspace;

	const [name, setName] = useState(workspace?.name || "");
	const [slug, setSlug] = useState(workspace?.slug || "");
	const [isUploadingLogo, setIsUploadingLogo] = useState(false);

	const { mutateAsync: upload } = useMutation(orpc.upload.mutationOptions());

	useEffect(() => {
		if (workspace) {
			setName(workspace.name);
			setSlug(workspace.slug);
		}
	}, [workspace]);

	const handleUpdateWorkspace = async () => {
		if (name === workspace?.name && slug === workspace?.slug) return;
		try {
			const { error } = await authClient.organization.update({
				organizationId: workspace.id,
				data: {
					name,
					slug,
				},
			});
			if (error) throw error;
			toast.success("Workspace updated successfully");
			queryClient.invalidateQueries();
			if (slug !== workspace.slug) {
				navigate({ to: "/$slug/settings/workspace/general", params: { slug } });
			}
		} catch (error) {
			const message =
				error instanceof Error ? error.message : "Failed to update workspace";
			toast.error(message);
		}
	};

	const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		setIsUploadingLogo(true);
		try {
			const { url } = await upload({ file });
			const absoluteUrl = `${env.VITE_SERVER_URL}${url}`;

			await authClient.organization.update({
				organizationId: workspace.id,
				data: {
					logo: absoluteUrl,
				},
			});
			toast.success("Logo updated successfully");
			queryClient.invalidateQueries();
		} catch (error) {
			const message =
				error instanceof Error ? error.message : "Failed to update logo";
			toast.error(message);
		} finally {
			setIsUploadingLogo(false);
		}
	};

	return (
		<div className="flex flex-col gap-10">
			<ItemGroup className="gap-0 rounded-md text-foreground/80">
				<Item variant={"muted"}>
					<ItemContent>
						<ItemTitle className="text-base">Workspace logo</ItemTitle>
						<ItemDescription>
							This is your workspace's logo for identification.
						</ItemDescription>
					</ItemContent>
					<ItemActions>
						<div className="group relative cursor-pointer">
							<Avatar className="h-12 w-12 rounded-md">
								<AvatarImage
									src={workspace?.logo || ""}
									className={"rounded-md"}
								/>
								<AvatarFallback className="rounded-md text-lg">
									{workspace?.name?.charAt(0) || "W"}
								</AvatarFallback>
							</Avatar>
							<label
								htmlFor="logo-upload"
								className={cn(
									"absolute inset-0 flex cursor-pointer items-center justify-center rounded-md bg-background-foreground/40 opacity-0 transition-opacity group-hover:opacity-100",
									isUploadingLogo && "cursor-not-allowed opacity-100",
								)}
							>
								{isUploadingLogo ? (
									<IconLoader2 className="h-6 w-6 animate-spin text-accent" />
								) : (
									<IconCamera className="h-6 w-6 text-accent" />
								)}
							</label>
							<Input
								id="logo-upload"
								type="file"
								className="hidden"
								accept="image/*"
								onChange={handleLogoChange}
								disabled={isUploadingLogo}
							/>
						</div>
					</ItemActions>
				</Item>

				<Separator />

				<Item variant={"muted"}>
					<ItemContent>
						<ItemTitle className="text-base">Workspace name</ItemTitle>
						<ItemDescription>The name of your workspace.</ItemDescription>
					</ItemContent>
					<ItemActions className="gap-2">
						<Input
							value={name}
							onChange={(e) => setName(e.target.value)}
							onBlur={handleUpdateWorkspace}
							className="max-w-[250px] bg-background"
						/>
					</ItemActions>
				</Item>

				<Separator />

				<Item variant={"muted"}>
					<ItemContent>
						<ItemTitle className="text-base">Workspace slug</ItemTitle>
						<ItemDescription>
							The unique identifier for your workspace in the URL.
						</ItemDescription>
					</ItemContent>
					<ItemActions className="gap-2">
						<Input
							value={slug}
							onChange={(e) => setSlug(e.target.value)}
							onBlur={handleUpdateWorkspace}
							className="max-w-[250px] bg-background"
						/>
					</ItemActions>
				</Item>
			</ItemGroup>

			<div className="flex flex-col gap-4">
				<h2 className="font-semibold text-destructive text-lg">Danger Zone</h2>
				<Separator />
				<ItemGroup className="rounded-md">
					<Item
						variant="muted"
						className="cursor-pointer transition-colors hover:bg-muted/80"
						onClick={() =>
							open({
								type: "DELETE_WORKSPACE",
								data: { workspace },
							})
						}
					>
						<ItemContent className="gap-1">
							<ItemTitle className="font-medium text-destructive">
								Delete workspace
							</ItemTitle>
							<ItemDescription>
								Permanently delete this workspace and all its data.
							</ItemDescription>
						</ItemContent>
						<ItemActions>
							<IconChevronRight className="text-muted-foreground" />
						</ItemActions>
					</Item>
				</ItemGroup>
			</div>
		</div>
	);
}
