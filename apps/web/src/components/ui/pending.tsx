/**
 * Pending state component for Base UI with Tabler icons
 * Based on React Aria's Button implementation
 * @see https://github.com/adobe/react-spectrum/blob/main/packages/react-aria-components/src/Button.tsx
 */

import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "@/lib/utils";

interface UsePendingOptions {
	id?: string;
	isPending?: boolean;
	disabled?: boolean;
}

interface UsePendingReturn<T extends HTMLElement = HTMLElement> {
	pendingProps: React.HTMLAttributes<T> & {
		"aria-busy"?: "true";
		"aria-disabled"?: "true";
		"data-pending"?: true;
		"data-disabled"?: true;
	};
	isPending: boolean;
}

function usePending<T extends HTMLElement = HTMLElement>(
	options: UsePendingOptions = {},
): UsePendingReturn<T> {
	const { id, isPending = false, disabled = false } = options;

	const instanceId = React.useId();
	const pendingId = id || instanceId;

	const pendingProps = React.useMemo(() => {
		const props: React.HTMLAttributes<T> & {
			"aria-busy"?: "true";
			"aria-disabled"?: "true";
			"data-pending"?: true;
			"data-disabled"?: true;
		} = {
			id: pendingId,
		};

		if (isPending) {
			props["aria-busy"] = "true";
			props["aria-disabled"] = "true";
			props["data-pending"] = true;

			function onEventPrevent(event: React.SyntheticEvent) {
				event.preventDefault();
			}

			function onKeyEventPrevent(event: React.KeyboardEvent<T>) {
				if (event.key === "Enter" || event.key === " ") {
					event.preventDefault();
				}
			}

			props.onClick = onEventPrevent;
			props.onPointerDown = onEventPrevent;
			props.onPointerUp = onEventPrevent;
			props.onMouseDown = onEventPrevent;
			props.onMouseUp = onEventPrevent;
			props.onKeyDown = onKeyEventPrevent;
			props.onKeyUp = onKeyEventPrevent;
		}

		if (disabled) {
			props["data-disabled"] = true;
		}

		return props;
	}, [isPending, disabled, pendingId]);

	return React.useMemo(() => {
		return {
			pendingProps,
			isPending,
		};
	}, [pendingProps, isPending]);
}

const pendingVariants = cva("transition-opacity", {
	variants: {
		pending: {
			true: "cursor-not-allowed opacity-50",
			false: "opacity-100",
		},
	},
	defaultVariants: {
		pending: false,
	},
});

interface PendingProps extends useRender.ComponentProps<"div"> {
	isPending?: boolean;
	disabled?: boolean;
}

function Pending({
	id,
	isPending = false,
	disabled = false,
	className,
	render,
	...props
}: PendingProps & VariantProps<typeof pendingVariants>) {
	const { pendingProps } = usePending({ id, isPending, disabled });

	return useRender({
		defaultTagName: "div",
		props: mergeProps<"div">(
			{
				className: cn(pendingVariants({ pending: isPending, className })),
			},
			pendingProps,
			props,
		),
		render,
		state: {
			slot: "pending",
			isPending,
			disabled,
		},
	});
}

export {
	Pending,
	usePending,
	pendingVariants,
	type UsePendingOptions,
	type UsePendingReturn,
	type PendingProps,
};
