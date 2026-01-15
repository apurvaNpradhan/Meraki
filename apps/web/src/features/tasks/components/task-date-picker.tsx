import {
	IconArmchair,
	IconCalendar,
	IconCalendarEvent,
	IconCircleOff,
	IconSun,
} from "@tabler/icons-react";
import {
	addDays,
	format,
	nextMonday,
	startOfToday,
	startOfTomorrow,
} from "date-fns";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface TaskDatePickerProps {
	date?: Date | null;
	onSelect: (date?: Date | null) => void;
	className?: string;
}

export function TaskDatePicker({
	date,
	onSelect,
	className,
}: TaskDatePickerProps) {
	const today = startOfToday();
	const tomorrow = startOfTomorrow();

	const thisWeekend = addDays(today, (6 - today.getDay() + 7) % 7 || 7);
	const nextWeek = nextMonday(today);

	const quickOptions = [
		{
			label: "Tomorrow",
			icon: IconSun,
			date: tomorrow,
			sub: format(tomorrow, "EEE"),
			color: "text-orange-500",
		},
		{
			label: "This weekend",
			icon: IconArmchair,
			date: thisWeekend,
			sub: format(thisWeekend, "EEE"),
			color: "text-blue-500",
		},

		{
			label: "No Date",
			icon: IconCircleOff,
			date: null,
			sub: "",
			color: "text-muted-foreground",
		},
	];

	return (
		<Popover>
			<PopoverTrigger
				render={
					<Button
						variant="ghost"
						size="sm"
						className={cn(
							"flex h-8 w-full items-center justify-start gap-2 px-2 font-normal",
							!date && "text-muted-foreground",
							className,
						)}
						onClick={(e) => e.stopPropagation()}
					>
						<IconCalendar className="size-4" />
						<span>{date ? format(date, "d MMM") : "Schedule"}</span>
					</Button>
				}
			/>
			<PopoverContent
				align="end"
				side="bottom"
				onClick={(e) => e.stopPropagation()}
			>
				<div className="flex flex-col border-b p-1">
					<div className="px-2 py-1 font-semibold text-muted-foreground text-xs uppercase tracking-wider">
						{format(today, "d MMM")}
					</div>
					{quickOptions.map((option) => (
						<button
							key={option.label}
							type="button"
							className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-accent"
							onClick={() => onSelect(option.date)}
						>
							<div className="flex items-center gap-2">
								<option.icon className={cn("size-4", option.color)} />
								<span>{option.label}</span>
							</div>
							<span className="text-muted-foreground text-xs">
								{option.sub}
							</span>
						</button>
					))}
				</div>
				<Calendar
					mode="single"
					selected={date ?? undefined}
					onSelect={(d) => onSelect(d)}
					className="w-full p-1"
				/>
			</PopoverContent>
		</Popover>
	);
}
