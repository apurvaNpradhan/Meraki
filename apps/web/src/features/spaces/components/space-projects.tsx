import { IconChevronDown, IconChevronUp, IconPlus } from "@tabler/icons-react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { ProjectItem } from "@/features/projects/components/project-item";
import { getStatusIcon } from "@/features/projects/components/status-selector";
import { useProjectsBySpaceId } from "@/features/projects/hooks/use-project";
import { useModal } from "@/stores/modal.store";
import type { ProjectBySpaceItem } from "@/types/project";
import { orpc } from "@/utils/orpc";

type GroupBy = "status" | "priority" | "none";

export function SpaceProjects({ id }: { id: string }) {
	const { data } = useProjectsBySpaceId(id);
	const projectStatuses = useSuspenseQuery(
		orpc.projectStatus.all.queryOptions(),
	);
	const [groupBy, _setGroupBy] = useState<GroupBy>("status");
	const { open } = useModal();

	const groupedItems = useMemo(() => {
		if (!data || !projectStatuses.data) return {};

		const groups: Record<string, ProjectBySpaceItem[]> = {};

		if (groupBy === "status") {
			for (const status of projectStatuses.data) {
				groups[status.publicId] = [];
			}
			groups.uncategorized = [];
			for (const project of data) {
				const key = project.projectStatus?.publicId ?? "uncategorized";
				if (!groups[key]) groups[key] = [];
				groups[key].push(project);
			}
		} else if (groupBy === "priority") {
			for (let i = 0; i <= 4; i++) {
				groups[i.toString()] = [];
			}
			for (const project of data) {
				const key = (project.priority ?? 0).toString();
				if (!groups[key]) groups[key] = [];
				groups[key].push(project);
			}
		} else {
			groups.all = [...data];
		}

		// Remove empty groups as requested
		const filteredGroups: Record<string, ProjectBySpaceItem[]> = {};
		for (const key in groups) {
			if (groups[key].length > 0) {
				// Default sort by position
				filteredGroups[key] = groups[key].sort((a, b) =>
					a.position.localeCompare(b.position),
				);
			}
		}

		return filteredGroups;
	}, [data, projectStatuses.data, groupBy]);

	const sortedGroupKeys = useMemo(() => {
		return Object.keys(groupedItems).sort((a, b) => {
			if (groupBy === "status") {
				const statusA = projectStatuses.data.find((s) => s.publicId === a);
				const statusB = projectStatuses.data.find((s) => s.publicId === b);
				if (!statusA || !statusB) return 0;
				return statusA.position.localeCompare(statusB.position);
			}
			if (groupBy === "priority") {
				return Number.parseInt(b, 10) - Number.parseInt(a, 10);
			}
			return 0;
		});
	}, [groupedItems, groupBy, projectStatuses.data]);

	if (!data) return null;

	const projects = data;

	return (
		<div className="flex w-full flex-col">
			<div className="flex flex-col">
				<div className="flex flex-row items-center justify-end" />

				{projects?.length === 0 ? (
					<div className="flex h-32 items-center justify-center rounded-lg border-2 border-muted-foreground/20 border-dashed">
						<span className="text-muted-foreground text-sm">
							No projects in this space
						</span>
					</div>
				) : (
					<Accordion
						className="flex flex-col"
						multiple
						defaultValue={sortedGroupKeys}
					>
						{sortedGroupKeys.map((groupKey) => {
							const groupProjects = groupedItems[groupKey] ?? [];
							let label = groupKey;
							let icon = null;

							if (groupBy === "status") {
								const status = projectStatuses.data.find(
									(s) => s.publicId === groupKey,
								);
								label = status?.name ?? "Uncategorized";
								icon = status
									? getStatusIcon(status.type, status.colorCode)
									: null;
							} else if (groupBy === "priority") {
								const priorityIdx = Number.parseInt(groupKey, 10);
								const priorityLabels = [
									"No Priority",
									"Low",
									"Medium",
									"High",
									"Urgent",
								];
								label = priorityLabels[priorityIdx];
							} else {
								label = "All Projects";
							}

							const status =
								groupBy === "status"
									? projectStatuses.data.find((s) => s.publicId === groupKey)
									: null;

							return (
								<AccordionItem
									className="w-full border-none"
									value={groupKey}
									key={groupKey}
								>
									<AccordionTrigger
										className="flex w-full flex-row items-center justify-between rounded-none border-none bg-background p-2 transition-colors hover:bg-muted hover:no-underline data-[state=open]:bg-muted"
										style={{
											borderLeft: status?.colorCode
												? `6px solid ${status.colorCode}`
												: undefined,
											backgroundColor: status?.colorCode
												? `color-mix(in srgb, ${status.colorCode} 6%, var(--background))`
												: undefined,
										}}
									>
										<div className="flex items-center gap-2">
											<Button
												variant={"ghost"}
												size="icon-sm"
												className="flex items-center hover:text-primary"
											>
												<IconChevronDown
													data-slot="accordion-trigger-icon"
													className="pointer-events-none shrink-0 group-aria-expanded/accordion-trigger:hidden"
												/>
												<IconChevronUp
													data-slot="accordion-trigger-icon"
													className="pointer-events-none hidden shrink-0 group-aria-expanded/accordion-trigger:inline"
												/>
											</Button>

											{icon}
											<h3 className="font-semibold text-foreground/70 text-sm">
												{label}
											</h3>
											<span className="text-muted-foreground text-xs">
												{groupProjects.length}
											</span>
										</div>
										<Button
											variant="ghost"
											size="icon-xs"
											onClick={(e) => {
												e.stopPropagation();
												open({
													type: "CREATE_PROJECT",
													data: {
														spacePublicId: id,
														data: {
															...(groupBy === "status" && {
																projectStatusPublicId: groupKey,
															}),
															...(groupBy === "priority" && {
																priority: Number.parseInt(groupKey, 10),
															}),
														},
													},
													modalSize: "lg",
												});
											}}
										>
											<IconPlus />
										</Button>
									</AccordionTrigger>
									<AccordionContent className="flex flex-col p-0">
										{groupProjects.map((project) => (
											<ProjectItem
												key={project.publicId}
												project={project}
												spacePublicId={id}
											/>
										))}
									</AccordionContent>
								</AccordionItem>
							);
						})}
					</Accordion>
				)}
			</div>
		</div>
	);
}
