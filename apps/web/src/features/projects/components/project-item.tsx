import { IconDotsVertical, IconTrash } from "@tabler/icons-react";
import { useLoaderData, useNavigate } from "@tanstack/react-router";
import { IconAndColorPicker } from "@/components/icon-and-colorpicker";
import { PrioritySelector } from "@/components/priority-selector";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Item,
	ItemActions,
	ItemContent,
	ItemMedia,
	ItemTitle,
} from "@/components/ui/item";
import { cn } from "@/lib/utils";
import { useModal } from "@/stores/modal.store";
import type { ProjectBySpaceItem } from "@/types/project";
import { useUpdateProject } from "../hooks/use-project";
import { StatusSelector } from "./status-selector";

interface ProjectItemProps {
	project: ProjectBySpaceItem;
	spacePublicId: string;
	className?: string;
}

export function ProjectItem({
	project,
	spacePublicId,
	className,
}: ProjectItemProps) {
	const updateProject = useUpdateProject({ spacePublicId });
	const { open } = useModal();
	const navigate = useNavigate();
	const { workspace } = useLoaderData({ from: "/(authenicated)/$slug" });

	return (
		<Item
			className={cn(
				"group/project-item rounded-none p-2 transition-all hover:bg-accent/40",
				className,
			)}
			variant="default"
		>
			<ItemMedia>
				<IconAndColorPicker
					icon={project.icon}
					color={project.colorCode}
					iconSize={18}
					onIconChange={(icon) =>
						updateProject.mutate({
							projectPublicId: project.publicId,
							icon,
						})
					}
					onColorChange={(colorCode) =>
						updateProject.mutate({
							projectPublicId: project.publicId,
							colorCode,
						})
					}
				/>
			</ItemMedia>

			<ItemContent
				className="cursor-pointer"
				role="button"
				tabIndex={0}
				onClick={() =>
					navigate({
						to: "/$slug/projects/$id",
						params: { slug: workspace.slug, id: project.publicId },
					})
				}
				onKeyDown={(e) => {
					if (e.key === "Enter" || e.key === " ") {
						navigate({
							to: "/$slug/projects/$id",
							params: { slug: workspace.slug, id: project.publicId },
						});
					}
				}}
			>
				<ItemTitle>{project.name}</ItemTitle>
			</ItemContent>

			<ItemActions>
				<div className="flex items-center">
					<StatusSelector
						project={project}
						spacePublicId={spacePublicId}
						className="w-fit"
						projectPublicId={project.publicId}
						showLabel={false}
					/>

					<PrioritySelector
						value={project.priority}
						className="w-fit"
						onPriorityChange={(priority) =>
							updateProject.mutate({
								projectPublicId: project.publicId,
								priority,
							})
						}
						showLabel={false}
					/>

					<DropdownMenu>
						<DropdownMenuTrigger
							render={
								<Button
									variant="ghost"
									size="icon"
									className="h-8 w-8 hover:bg-accent"
								>
									<IconDotsVertical className="h-4 w-4" />
								</Button>
							}
						/>
						<DropdownMenuContent align="end" className="w-48">
							<DropdownMenuSeparator />

							<DropdownMenuItem
								className="text-destructive focus:bg-destructive focus:text-destructive-foreground"
								onClick={() =>
									open({
										type: "DELETE_PROJECT",
										data: {
											project: {
												...project,
												spacePublicId,
											},
										},
									})
								}
							>
								<IconTrash className="mr-2 h-4 w-4" />
								Delete Project
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</ItemActions>
		</Item>
	);
}

export function ProjectItemSkeleton() {
	return (
		<Item className="rounded-none border-none p-2">
			<ItemMedia>
				<div className="h-5 w-5 animate-pulse rounded bg-muted" />
			</ItemMedia>
			<ItemContent>
				<div className="h-4 w-48 animate-pulse rounded bg-muted" />
			</ItemContent>
			<ItemActions>
				<div className="h-8 w-24 animate-pulse rounded bg-muted" />
			</ItemActions>
		</Item>
	);
}
