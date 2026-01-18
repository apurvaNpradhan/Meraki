import { ContentEditable as LexicalContentEditable } from "@lexical/react/LexicalContentEditable";
import type { JSX } from "react";

type Props = {
	placeholder: string;
	className?: string;
	placeholderClassName?: string;
};

export function ContentEditable({
	placeholder,
	className,
	placeholderClassName,
}: Props): JSX.Element {
	return (
		<LexicalContentEditable
			className={
				className ??
				"ContentEditable__root relative block h-full min-h-40 overflow-auto py-3 focus:outline-none"
			}
			aria-placeholder={placeholder}
			placeholder={
				<div
					className={
						placeholderClassName ??
						"pointer-events-none absolute top-[18px] select-none overflow-hidden text-ellipsis text-muted-foreground"
					}
				>
					{placeholder}
				</div>
			}
		/>
	);
}
