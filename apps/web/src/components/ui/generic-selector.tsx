import { IconCheck } from "@tabler/icons-react";
import type React from "react";
import { useEffect, useId, useState } from "react";
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

export interface SelectorItem<T> {
	id: string;
	name: string;
	icon: React.FC<React.SVGProps<SVGSVGElement>>;
	value: T;
}

interface GenericSelectorProps<T> {
	items: SelectorItem<T>[];
	value: T;
	onValueChange?: (value: T) => void;
	showLabel?: boolean;
	placeholder?: string;
	className?: string;
}

export function GenericSelector<T>({
	items,
	value,
	onValueChange,
	showLabel = false,
	placeholder = "Select...",
	className,
}: GenericSelectorProps<T>) {
	const id = useId();
	const [open, setOpen] = useState<boolean>(false);
	const [internalValue, setInternalValue] = useState<T>(value);

	const handleSelect = (newValue: T) => {
		setInternalValue(newValue);
		setOpen(false);
		onValueChange?.(newValue);
	};

	useEffect(() => {
		setInternalValue(value);
	}, [value]);

	const selectedItem = items.find((item) => item.value === internalValue);

	return (
		<div className={cn("inline-block", className)}>
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<Button
						id={id}
						variant="ghost"
						size="sm"
						className="flex h-8 items-center gap-2 px-2"
						role="combobox"
						aria-expanded={open}
					>
						{selectedItem ? (
							<>
								<selectedItem.icon className="size-4 text-muted-foreground" />
								{showLabel && (
									<span className="font-medium text-xs">
										{selectedItem.name}
									</span>
								)}
							</>
						) : (
							<span className="text-muted-foreground text-xs">
								{placeholder}
							</span>
						)}
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-48 p-0" align="start">
					<Command>
						<CommandInput placeholder={placeholder} />
						<CommandList>
							<CommandEmpty>No results found.</CommandEmpty>
							<CommandGroup>
								{items.map((item) => (
									<CommandItem
										key={item.id}
										onSelect={() => handleSelect(item.value)}
										className="flex items-center justify-between"
									>
										<div className="flex items-center gap-2">
											<item.icon className="size-4 text-muted-foreground" />
											<span className="text-xs">{item.name}</span>
										</div>
										{internalValue === item.value && (
											<IconCheck size={14} className="ml-auto" />
										)}
									</CommandItem>
								))}
							</CommandGroup>
						</CommandList>
					</Command>
				</PopoverContent>
			</Popover>
		</div>
	);
}
