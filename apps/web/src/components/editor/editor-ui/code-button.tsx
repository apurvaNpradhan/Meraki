import { $isCodeNode } from "@lexical/code";
import { IconCheck, IconCopy } from "@tabler/icons-react";
import {
	$getNearestNodeFromDOMNode,
	$getSelection,
	$setSelection,
	type LexicalEditor,
} from "lexical";
import { useState } from "react";

import { useDebounce } from "@/components/editor/editor-hooks/use-debounce";
import { Button } from "@/components/ui/button";

interface Props {
	editor: LexicalEditor;
	getCodeDOMNode: () => HTMLElement | null;
}

export function CopyButton({ editor, getCodeDOMNode }: Props) {
	const [isCopyCompleted, setCopyCompleted] = useState<boolean>(false);

	const removeSuccessIcon = useDebounce(() => {
		setCopyCompleted(false);
	}, 1000);

	async function handleClick(): Promise<void> {
		const codeDOMNode = getCodeDOMNode();

		if (!codeDOMNode) {
			return;
		}

		let content = "";

		editor.update(() => {
			const codeNode = $getNearestNodeFromDOMNode(codeDOMNode);

			if ($isCodeNode(codeNode)) {
				content = codeNode.getTextContent();
			}

			const selection = $getSelection();
			$setSelection(selection);
		});

		try {
			await navigator.clipboard.writeText(content);
			setCopyCompleted(true);
			removeSuccessIcon();
		} catch (err) {
			console.error("Failed to copy: ", err);
		}
	}

	return (
		<Button
			size="icon"
			className="flex shrink-0 cursor-pointer items-center rounded border border-transparent bg-none p-1 text-foreground/50 uppercase"
			onClick={handleClick}
			aria-label="copy"
		>
			{isCopyCompleted ? (
				<IconCheck className="size-4" />
			) : (
				<IconCopy className="size-4" />
			)}
		</Button>
	);
}
