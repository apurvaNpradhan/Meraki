import type { StatusType } from "@meraki/api/types/status";
import { IconLayout, IconSearch, IconX } from "@tabler/icons-react";
import { useState } from "react";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupInput,
} from "@/components/ui/input-group";
import { Item, ItemFooter, ItemMedia } from "@/components/ui/item";
import {
	ResponsiveModalDescription,
	ResponsiveModalHeader,
	ResponsiveModalTitle,
} from "@/components/ui/responsive-modal";
import { Status, StatusIndicator, StatusLabel } from "@/components/ui/status";
import { cn } from "@/lib/utils";
import { useModal } from "@/stores/modal.store";

export interface Template {
	id: string;
	name: string;
	description?: string;
	statuses: {
		name: string;
		colorCode: string;
		type: StatusType;
		position: string;
	}[];
}

interface TemplateProjectsProps {
	currentTemplate: Template | null;
	setCurrentTemplate: (template: Template | null) => void;
}
export const getTemplates = (): Template[] => [
	{
		id: "kanban",
		name: "Kanban",
		description: "Simple workflow for any project.",
		statuses: [
			{
				name: "To Do",
				colorCode: "#5C6773",
				type: "not-started",
				position: "a",
			},
			{
				name: "In Progress",
				colorCode: "#59C2FF",
				type: "active",
				position: "b",
			},
			{
				name: "Done",
				colorCode: "#AAD94C",
				type: "done",
				position: "c",
			},
		],
	},
	{
		id: "time-based",
		name: "Time Blocks",
		description: "Organize tasks by when you'll tackle them.",
		statuses: [
			{
				name: "Today",
				colorCode: "#F07178",
				type: "active",
				position: "a",
			},
			{
				name: "Tomorrow",
				colorCode: "#FFB454",
				type: "not-started",
				position: "b",
			},
			{
				name: "This Week",
				colorCode: "#59C2FF",
				type: "not-started",
				position: "c",
			},
			{
				name: "Later",
				colorCode: "#5C6773",
				type: "not-started",
				position: "d",
			},
			{
				name: "Ongoing",
				colorCode: "#D4BFFF",
				type: "active",
				position: "e",
			},
		],
	},
	{
		id: "development",
		name: "Development",
		description: "Track features, fixes, and releases.",
		statuses: [
			{
				name: "Backlog",
				colorCode: "#5C6773",
				type: "not-started",
				position: "a",
			},
			{
				name: "Todo",
				colorCode: "#8A9199",
				type: "not-started",
				position: "b",
			},
			{
				name: "In Progress",
				colorCode: "#59C2FF",
				type: "active",
				position: "c",
			},
			{
				name: "In Review",
				colorCode: "#FFB454",
				type: "active",
				position: "d",
			},
			{
				name: "Done",
				colorCode: "#AAD94C",
				type: "done",
				position: "e",
			},
			{
				name: "Cancelled",
				colorCode: "#F07178",
				type: "done",
				position: "f",
			},
		],
	},
	{
		id: "project-management",
		name: "Project Stages",
		description: "Manage initiatives from concept to completion.",
		statuses: [
			{
				name: "Planning",
				colorCode: "#D4BFFF",
				type: "not-started",
				position: "a",
			},
			{
				name: "In Progress",
				colorCode: "#59C2FF",
				type: "active",
				position: "b",
			},
			{
				name: "On Hold",
				colorCode: "#FFB454",
				type: "not-started",
				position: "c",
			},
			{
				name: "Completed",
				colorCode: "#AAD94C",
				type: "done",
				position: "d",
			},
			{
				name: "Archived",
				colorCode: "#5C6773",
				type: "done",
				position: "e",
			},
		],
	},
];

export const TemplateProjects = ({
	currentTemplate,
	setCurrentTemplate,
}: TemplateProjectsProps) => {
	const { close } = useModal();
	const [search, setSearch] = useState("");
	const templates = getTemplates().filter((t) =>
		t.name.toLowerCase().includes(search.toLowerCase()),
	);

	return (
		<div className="flex max-h-[calc(100vh-10rem)] flex-col gap-6">
			<ResponsiveModalHeader>
				<div className="flex items-center justify-between">
					<div className="space-y-1">
						<ResponsiveModalTitle className="font-bold text-xl tracking-tight">
							Project Templates
						</ResponsiveModalTitle>
						<ResponsiveModalDescription className="text-muted-foreground">
							Choose a template to pre-configure your project's workflow.
						</ResponsiveModalDescription>
					</div>
				</div>
			</ResponsiveModalHeader>
			<InputGroup>
				<InputGroupInput
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					placeholder="Search templates..."
				/>
				<InputGroupAddon align={"inline-start"}>
					<IconSearch size={18} />
				</InputGroupAddon>
				{search && (
					<InputGroupAddon align={"inline-end"}>
						<InputGroupButton
							variant={"ghost"}
							onClick={() => setSearch("")}
							className="rounded-md p-1 text-muted-foreground/50 hover:bg-muted"
						>
							<IconX size={14} />
						</InputGroupButton>
					</InputGroupAddon>
				)}
			</InputGroup>

			<div className="flex flex-col space-y-4">
				{templates.map((template) => {
					const isSelected = currentTemplate?.id === template.id;

					return (
						<Item
							key={template.id}
							onClick={() => {
								setCurrentTemplate(isSelected ? null : template);
								close();
							}}
							className={cn(
								"hover:bg-accent/10",
								isSelected
									? "border border-border bg-accent/20"
									: "border-border/50 bg-card",
							)}
						>
							<ItemMedia>
								<div className="flex items-center gap-4" />
								<div className="space-y-0.5">
									<span className="font-semibold text-lg leading-tight tracking-tight">
										{template.name}
									</span>
									{template.description && (
										<p className="line-clamp-1 text-muted-foreground/80 text-sm">
											{template.description}
										</p>
									)}
								</div>
							</ItemMedia>

							<ItemFooter>
								<div className="flex flex-wrap items-center gap-2">
									{template.statuses.map((status) => (
										<Status key={status.name}>
											<StatusIndicator
												style={{
													backgroundColor: status.colorCode,
												}}
											/>
											<StatusLabel>{status.name}</StatusLabel>
										</Status>
									))}
								</div>
							</ItemFooter>
						</Item>
					);
				})}

				{templates.length === 0 && (
					<div className="flex flex-col items-center justify-center py-20 text-center opacity-40">
						<div className="relative mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-muted/20">
							<IconLayout size={40} strokeWidth={1} />
						</div>
						<h3 className="font-semibold text-lg">No templates found</h3>
						<p className="max-w-[240px] text-sm">
							Try searching for something else or browse all templates.
						</p>
					</div>
				)}
			</div>
		</div>
	);
};
