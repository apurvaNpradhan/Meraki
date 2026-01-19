import type { Status } from "@meraki/api/types/status";
import {
	IconCheck,
	IconCircle,
	IconCircleCheckFilled,
	IconCircleDashed,
	IconCircleHalf2,
	IconCircleXFilled,
} from "@tabler/icons-react";
import { useId, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface TaskStatusSelectorProps {
	showLabel?: boolean;
	statuses: Status[];
	className?: string;
	readOnly?: boolean;
	selectedStatusId?: string;
	onStatusChange?: (statusId: string) => void;
}

export const getTaskStatusIcon = (
	type: string,
	color: string,
	className?: string,
) => {
	const props = { size: 16, style: { color }, className };
	switch (type) {
		case "not-started":
			return <IconCircleDashed {...props} />;
		case "active":
			return <IconCircleHalf2 {...props} />;
		case "done":
			return <IconCircleCheckFilled {...props} />;
		case "closed":
			return <IconCircleXFilled {...props} />;
		default:
			return <IconCircle {...props} />;
	}
};

export function TaskStatusSelector({
	showLabel = false,
	statuses,
	className,
	readOnly = false,
	selectedStatusId,
	onStatusChange,
}: TaskStatusSelectorProps) {
	const id = useId();
	const [open, setOpen] = useState<boolean>(false);

	const handleStatusChange = (statusId: string) => {
		setOpen(false);
		if (onStatusChange) {
			onStatusChange(statusId);
		}
	};

	const currentStatus = statuses.find((s) => s.publicId === selectedStatusId);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger
				render={
					<Button
						id={id}
						variant="ghost"
						size="sm"
						role="combobox"
						onClick={(e) => e.stopPropagation()}
						aria-expanded={open}
						className={cn(!currentStatus && "text-muted-foreground", className)}
						disabled={readOnly}
					/>
				}
			>
				{currentStatus ? (
					<div className="flex items-center gap-2">
						{getTaskStatusIcon(currentStatus.type, currentStatus.colorCode)}
						{showLabel && (
							<span className="truncate font-semibold">
								{currentStatus.name}
							</span>
						)}
					</div>
				) : (
					<span className="text-xs">Select Status</span>
				)}
			</PopoverTrigger>
			<PopoverContent className="w-[200px] p-0" align="start">
				<Command>
					<CommandInput placeholder="Set status..." />
					<CommandList>
						<CommandEmpty>No status found.</CommandEmpty>
						<CommandGroup>
							{statuses.map((item) => (
								<CommandItem
									key={item.publicId}
									value={item.publicId}
									keywords={[item.name]}
									onSelect={() => handleStatusChange(item.publicId)}
									className="flex cursor-pointer items-center gap-2"
								>
									{getTaskStatusIcon(item.type, item.colorCode)}
									<span>{item.name}</span>
									{selectedStatusId === item.publicId && (
										<IconCheck size={16} className="ml-auto opacity-100" />
									)}
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
