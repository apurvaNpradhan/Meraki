import {
	IconCircle,
	IconCircleCheck,
	IconCircleDashed,
	IconCircleX,
} from "@tabler/icons-react";
import { GenericSelector, type SelectorItem } from "./ui/generic-selector";

export type TaskStatus = "todo" | "in_progress" | "done" | "canceled";

export const statuses: SelectorItem<TaskStatus>[] = [
	{ id: "todo", name: "Todo", value: "todo", icon: IconCircle },
	{
		id: "in_progress",
		name: "In Progress",
		value: "in_progress",
		icon: IconCircleDashed,
	},
	{ id: "done", name: "Done", value: "done", icon: IconCircleCheck },
	{ id: "canceled", name: "Canceled", value: "canceled", icon: IconCircleX },
];

interface StatusSelectorProps {
	value?: TaskStatus;
	onStatusChange?: (status: TaskStatus) => void;
	showLabel?: boolean;
}

export function StatusSelector({
	value = "todo",
	onStatusChange,
	showLabel = false,
}: StatusSelectorProps) {
	return (
		<GenericSelector
			items={statuses}
			value={value}
			onValueChange={onStatusChange}
			showLabel={showLabel}
			placeholder="Status"
		/>
	);
}
