import type { SelectTaskType, UpdateTaskType } from "@meraki/api/types";
import type { Status } from "@meraki/api/types/status";
import {
	IconChevronDown,
	IconChevronUp,
	IconFilter,
	IconPlus,
	IconSortAscending,
} from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { useLoaderData } from "@tanstack/react-router";
import {
	differenceInCalendarDays,
	format,
	isPast,
	isToday,
	isTomorrow,
} from "date-fns";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { PrioritySelector, priorities } from "@/components/priority-selector";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Item,
	ItemActions,
	ItemContent,
	ItemDescription,
	ItemMedia,
	ItemTitle,
} from "@/components/ui/item";
import { cn } from "@/lib/utils";
import { useModal } from "@/stores/modal.store";
import { orpc } from "@/utils/orpc";
import { useUpdateTask } from "../hooks/use-tasks";
import { getTaskStatusIcon, TaskStatusSelector } from "./task-status-selector";

export type GroupBy = "none" | "priority" | "deadline" | "status";
export type SortBy = "default" | "name" | "createdAt" | "priority";

export const priorityLabels: Record<number, string> = {
	0: "No Priority",
	1: "Low Priority",
	2: "Medium Priority",
	3: "High Priority",
	4: "Urgent Priority",
};

export function ViewSettingsSelector({
	groupBy,
	onGroupByChange,
	sortBy,
	onSortByChange,
	showStatusGrouping = false,
}: {
	groupBy: GroupBy;
	onGroupByChange: (v: GroupBy) => void;
	sortBy: SortBy;
	onSortByChange: (v: SortBy) => void;
	showStatusGrouping?: boolean;
}) {
	const groupingOptions = [
		{ id: "none", label: "No Grouping" },
		{ id: "priority", label: "Priority" },
		{ id: "deadline", label: "Deadline" },
		...(showStatusGrouping ? [{ id: "status", label: "Status" }] : []),
	];

	const sortingOptions = [
		{ id: "default", label: "Default" },
		{ id: "name", label: "Name" },
		{ id: "createdAt", label: "Created At" },
		{ id: "priority", label: "Priority" },
	];

	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				render={
					<Button
						variant="ghost"
						size="sm"
						className="gap-2 text-muted-foreground hover:text-foreground"
					>
						<IconFilter className="h-4 w-4" />
						<span>View</span>
					</Button>
				}
			/>
			<DropdownMenuContent align="end" className="w-48">
				<DropdownMenuSub>
					<DropdownMenuSubTrigger>
						<IconFilter className="mr-2 h-4 w-4" />
						Group by
					</DropdownMenuSubTrigger>
					<DropdownMenuSubContent>
						<DropdownMenuRadioGroup
							value={groupBy}
							onValueChange={(v) => onGroupByChange(v as GroupBy)}
						>
							{groupingOptions.map((item) => (
								<DropdownMenuRadioItem key={item.id} value={item.id}>
									{item.label}
								</DropdownMenuRadioItem>
							))}
						</DropdownMenuRadioGroup>
					</DropdownMenuSubContent>
				</DropdownMenuSub>

				<DropdownMenuSub>
					<DropdownMenuSubTrigger>
						<IconSortAscending className="mr-2 h-4 w-4" />
						Sort by
					</DropdownMenuSubTrigger>
					<DropdownMenuSubContent>
						<DropdownMenuRadioGroup
							value={sortBy}
							onValueChange={(v) => onSortByChange(v as SortBy)}
						>
							{sortingOptions.map((item) => (
								<DropdownMenuRadioItem key={item.id} value={item.id}>
									{item.label}
								</DropdownMenuRadioItem>
							))}
						</DropdownMenuRadioGroup>
					</DropdownMenuSubContent>
				</DropdownMenuSub>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

export function TaskList({
	groupBy,
	sortBy,
	tasks: tasksProp,
	projectPublicId,
	statuses: statusesProp,
}: {
	groupBy: GroupBy;
	sortBy: SortBy;
	workspaceId: string;
	tasks?: SelectTaskType[];
	projectPublicId?: string;
	statuses?: Status[];
}) {
	const { data: projectData } = useQuery({
		...orpc.project.byId.queryOptions({
			input: { projectPublicId: projectPublicId! },
		}),
		enabled: !!projectPublicId && !statusesProp,
	});

	const statuses = statusesProp ?? projectData?.statuses;

	const { data: allTasks, isPending } = useQuery({
		...orpc.task.all.queryOptions({}),
		enabled: !tasksProp,
	});

	const tasks = tasksProp ?? allTasks;

	const [completingTaskIds, setCompletingTaskIds] = useState<Set<string>>(
		new Set(),
	);
	const updateTask = useUpdateTask({ projectPublicId });
	const { open } = useModal();
	const { workspace } = useLoaderData({ from: "/(authenicated)/$slug" });

	const handleUpdate = (task: SelectTaskType, input: UpdateTaskType) => {
		if (input.completedAt && !task.completedAt) {
			setCompletingTaskIds((prev) => new Set(prev).add(task.publicId));

			updateTask.mutate({
				taskId: task.publicId,
				workspaceId: workspace.id,
				input: {
					...input,
					isArchived: true,
				},
			});

			toast.success("Task moved to archived", {
				action: {
					label: "Undo",
					onClick: () => {
						updateTask.mutate({
							taskId: task.publicId,
							workspaceId: workspace.id,
							input: {
								taskPublicId: task.publicId,
								isArchived: false,
								completedAt: null,
							},
						});
					},
				},
			});

			setTimeout(() => {
				setCompletingTaskIds((prev) => {
					const next = new Set(prev);
					next.delete(task.publicId);
					return next;
				});
			}, 800);
		} else {
			updateTask.mutate({
				taskId: task.publicId,
				workspaceId: workspace.id,
				input,
			});
		}
	};

	const groupedTasks = useMemo(() => {
		if (!tasks) return [];

		const filteredTasks = tasks
			.filter(
				(task) => !task.isArchived || completingTaskIds.has(task.publicId),
			)
			.sort((a, b) => {
				if (sortBy === "default") return 0;
				if (sortBy === "name") return a.title.localeCompare(b.title);
				if (sortBy === "createdAt")
					return (
						new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
					);
				if (sortBy === "priority") return (b.priority ?? 0) - (a.priority ?? 0);
				return 0;
			});

		if (groupBy === "none") {
			return [
				{
					label: "All Tasks",
					tasks: filteredTasks,
					order: 1,
				},
			];
		}

		const groups = new Map<
			string,
			{ label: string; tasks: SelectTaskType[]; order: number; status?: Status }
		>();

		if (groupBy === "status" && statuses?.length) {
			for (const [index, status] of statuses.entries()) {
				groups.set(status.publicId, {
					label: status.name,
					tasks: [],
					order: index,
					status,
				});
			}
		}

		for (const task of filteredTasks) {
			let key = "other";
			let label = "Other";
			let order = 999;
			let status: Status | undefined;

			switch (groupBy) {
				case "priority": {
					const p = task.priority ?? 0;
					key = p.toString();
					label = priorityLabels[p] || "No Priority";
					order = 5 - p;
					break;
				}
				case "deadline": {
					if (!task.deadline) {
						key = "none";
						label = "No Deadline";
						order = 100;
					} else {
						const d = new Date(task.deadline);
						if (isPast(d) && !isToday(d)) {
							[key, label, order] = ["overdue", "Overdue", 1];
						} else if (isToday(d)) {
							[key, label, order] = ["today", "Today", 2];
						} else if (isTomorrow(d)) {
							[key, label, order] = ["tomorrow", "Tomorrow", 3];
						} else {
							[key, label, order] = ["future", "Upcoming", 4];
						}
					}
					break;
				}
				case "status": {
					if (task.status) {
						key = task.status.publicId;
						const projectStatus = statuses?.find((s) => s.publicId === key);
						if (projectStatus) {
							label = projectStatus.name;
							status = projectStatus;
							order = statuses?.indexOf(projectStatus) ?? 0;
						} else {
							label = task.status.name;
							status = task.status as Status;
							order = 1000;
						}
					} else {
						[key, label, order] = ["no-status", "No Status", -1];
					}
					break;
				}
			}

			const existing = groups.get(key);
			if (existing) {
				existing.tasks.push(task);
			} else {
				groups.set(key, { label, tasks: [task], order, status });
			}
		}

		return Array.from(groups.values()).sort((a, b) => a.order - b.order);
	}, [tasks, groupBy, sortBy, completingTaskIds, statuses]);

	if (isPending && !tasksProp) {
		return (
			<div className="flex flex-col gap-2">
				{[1, 2, 3].map((i) => (
					<div
						key={i}
						className="h-10 w-full animate-pulse rounded-md bg-muted/50"
					/>
				))}
			</div>
		);
	}

	return (
		<div className="flex flex-col">
			{groupedTasks.length > 0 ? (
				<Accordion
					multiple
					className="flex flex-col"
					defaultValue={groupedTasks.map((g) => g.label)}
				>
					{groupedTasks.map((group) => {
						const isEmpty = group.tasks.length === 0;
						if (isEmpty || groupBy === "none" || groupBy === "deadline")
							return null;

						return (
							<AccordionItem
								key={group.label}
								value={group.label}
								className="border-none"
							>
								<AccordionTrigger
									className="flex w-full flex-row items-center justify-between rounded-none border-none bg-background p-2 transition-colors hover:bg-muted hover:no-underline data-[state=open]:bg-muted"
									style={{
										borderLeft: group.status?.colorCode
											? `6px solid ${group.status.colorCode}`
											: undefined,
										backgroundColor: group.status?.colorCode
											? `color-mix(in srgb, ${group.status.colorCode} 6%, var(--background))`
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
										<h3 className="flex flex-row items-center gap-2 font-semibold text-foreground/70 text-sm">
											{group.status &&
												getTaskStatusIcon(
													group.status.type,
													group.status.colorCode,
												)}
											{group.label}
											<span className="font-normal text-muted-foreground text-xs">
												{group.tasks.length}
											</span>
										</h3>
									</div>

									{(groupBy === "status" || groupBy === "priority") && (
										<Button
											variant="ghost"
											size="icon-xs"
											onClick={(e) => {
												e.stopPropagation();
												open({
													type: "CREATE_TASK",
													modalSize: "lg",
													data: {
														data: {
															statusPublicId: group.status?.publicId,
															priority: group.tasks[0]?.priority,
														},
														projectPublicId,
														statuses,
													},
												});
											}}
										>
											<IconPlus />
										</Button>
									)}
								</AccordionTrigger>
								<AccordionContent className="flex flex-col p-0">
									<div className="flex flex-col">
										{group.tasks.map((task) => (
											<TaskListItem
												key={task.publicId}
												task={task}
												onUpdate={(input) => handleUpdate(task, input)}
												onDelete={() =>
													open({
														type: "DELETE_TASK",
														data: { task, projectPublicId },
													})
												}
												statuses={statuses}
											/>
										))}
									</div>
								</AccordionContent>
							</AccordionItem>
						);
					})}
				</Accordion>
			) : (
				!isPending && (
					<div className="flex flex-col items-center justify-center py-20 text-center">
						<p className="text-muted-foreground">No tasks found.</p>
					</div>
				)
			)}
		</div>
	);
}

export function TaskListItem({
	task,
	onUpdate,
	onDelete,
	statuses,
}: {
	task: SelectTaskType;
	onUpdate: (input: UpdateTaskType) => void;
	onDelete: () => void;
	statuses?: Status[];
}) {
	const { open } = useModal();
	const isDone = !!task.completedAt;
	const priority =
		priorities.find((p) => p.value === task.priority) ?? priorities[0];

	console.log(priority);
	return (
		<Item
			tabIndex={0}
			className="group cursor-pointer flex-nowrap gap-2 p-1 transition-colors duration-200 ease-out hover:bg-accent/30 md:gap-0"
			onKeyDown={(e) => {
				if (e.key === "Enter" || e.key === " ") {
					open({
						type: "TASK_DETAIL",
						data: { taskId: task.publicId },
					});
				}
			}}
		>
			<ItemMedia>
				<Checkbox
					style={{
						borderColor: `${priority.color} !important`,
						...(task.completedAt && {
							backgroundColor: `${priority.color} !important`,
						}),
					}}
					checked={isDone}
					className={cn(
						"rounded-full bg-transparent",
						"md:hidden md:-translate-x-4",
						"transition-all duration-200 ease-out",
						"group-hover:block group-hover:translate-x-1",
						"md:focus-visible:block md:focus-visible:translate-x-1",
						isDone && "md:block md:translate-x-0",
					)}
					onCheckedChange={(checked) => {
						onUpdate({
							taskPublicId: task.publicId,
							completedAt: checked ? new Date() : null,
						});
					}}
				/>
			</ItemMedia>
			<ItemContent
				className={cn(
					"min-w-0 transition-[margin] duration-200 ease-out",
					"group-hover:ml-1",
					isDone && "ml-1",
				)}
				onClick={() =>
					open({
						type: "TASK_DETAIL",
						modalSize: "lg",
						data: { taskId: task.publicId },
					})
				}
			>
				<ItemTitle
					className={cn(
						"block truncate px-3 text-[15px] leading-tight transition-colors",
						isDone && "text-muted-foreground line-through",
					)}
				>
					{task.title}
				</ItemTitle>
				{task.deadline && (
					<ItemDescription
						className={cn(
							"text-xs",

							getDueLabel(task.deadline).color,
						)}
					>
						{getDueLabel(task.deadline).date}
					</ItemDescription>
				)}
			</ItemContent>
			<ItemActions className="flex flex-row items-center gap-2">
				<PrioritySelector
					value={task.priority}
					className="w-fit"
					onPriorityChange={(priority) =>
						onUpdate({ taskPublicId: task.publicId, priority })
					}
				/>
				<TaskStatusSelector
					className="w-fit"
					statuses={statuses ?? []}
					selectedStatusId={task.status?.publicId}
					onStatusChange={(status) =>
						onUpdate({
							taskPublicId: task.publicId,
							statusPublicId: status,
						})
					}
				/>
			</ItemActions>
		</Item>
	);
}

export function TaskListItemSkeleton() {
	return (
		<Item className="gap-2 p-1">
			<ItemMedia>
				<div className="h-4 w-4 animate-pulse rounded-full bg-muted" />
			</ItemMedia>
			<ItemContent>
				<div className="h-4 w-64 animate-pulse rounded bg-muted" />
			</ItemContent>
			<ItemActions>
				<div className="h-4 w-12 animate-pulse rounded bg-muted" />
			</ItemActions>
		</Item>
	);
}

const getDueLabel = (date?: Date | null) => {
	const colors = {
		thisWeek: "text-orange-500",
		later: "text-muted-foreground",
	};
	if (!date)
		return {
			color: colors.later,
			date: "Due date",
		};

	if (isToday(date)) {
		return {
			color: colors.thisWeek,
			date: "Due today",
		};
	}

	const daysLeft = differenceInCalendarDays(date, new Date());

	if (daysLeft > 0 && daysLeft <= 7) {
		return {
			color: colors.thisWeek,
			date: daysLeft === 1 ? "1 day " : `${daysLeft} days `,
		};
	}

	return {
		color: colors.later,
		date: format(date, "d MMM"),
	};
};
