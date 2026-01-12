import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";
import { cn } from "@/lib/utils";

const statusVariants = cva(
	"inline-flex w-fit shrink-0 items-center gap-1.5 overflow-hidden whitespace-nowrap rounded-full border px-2.5 py-1 font-medium text-xs transition-colors",
	{
		variants: {
			variant: {
				default:
					"border-transparent bg-muted text-muted-foreground **:data-[slot=status-indicator]:bg-muted-foreground",
				success:
					"border-green-500/20 bg-green-500/10 text-green-600 **:data-[slot=status-indicator]:bg-green-600 dark:text-green-400 **:data-[slot=status-indicator]:dark:bg-green-400",
				error:
					"border-destructive/20 bg-destructive/10 text-destructive **:data-[slot=status-indicator]:bg-destructive",
				warning:
					"border-orange-500/20 bg-orange-500/10 text-orange-600 **:data-[slot=status-indicator]:bg-orange-600 dark:text-orange-400 **:data-[slot=status-indicator]:dark:bg-orange-400",
				info: "border-blue-500/20 bg-blue-500/10 text-blue-600 **:data-[slot=status-indicator]:bg-blue-600 dark:text-blue-400 **:data-[slot=status-indicator]:dark:bg-blue-400",
			},
		},
		defaultVariants: {
			variant: "default",
		},
	},
);

type DivProps = React.ComponentPropsWithoutRef<"div">;

function Status({
	className,
	variant = "default",
	render,
	...props
}: useRender.ComponentProps<"div"> & {
	variant?: VariantProps<typeof statusVariants>["variant"];
}) {
	const mergedProps = mergeProps(props, {
		"data-slot": "status",
		"data-variant": variant,
		className: cn(statusVariants({ variant }), className),
	});

	return useRender({
		defaultTagName: "div",
		props: mergedProps,
		render,
		state: {
			slot: "status",
			variant,
		},
	});
}

function StatusIndicator({
	className,
	render,
	...props
}: useRender.ComponentProps<"div">) {
	const mergedProps = mergeProps(props, {
		"data-slot": "status-indicator",
		className: cn(
			"relative flex size-2 shrink-0 rounded-full",
			"before:absolute before:inset-0 before:animate-ping before:rounded-full before:bg-inherit",
			"after:absolute after:inset-[2px] after:rounded-full after:bg-inherit",
			className,
		),
	});

	return useRender({
		defaultTagName: "div",
		props: mergedProps,
		render,
		state: {
			slot: "status-indicator",
		},
	});
}

function StatusLabel({
	className,
	render,
	...props
}: useRender.ComponentProps<"div">) {
	const mergedProps = mergeProps(props, {
		"data-slot": "status-label",
		className: cn("leading-none", className),
	});

	return useRender({
		defaultTagName: "div",
		props: mergedProps,
		render,
		state: {
			slot: "status-label",
		},
	});
}

export { Status, StatusIndicator, StatusLabel, statusVariants };
