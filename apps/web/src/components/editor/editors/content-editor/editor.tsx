"use client";

import {
	type InitialConfigType,
	LexicalComposer,
} from "@lexical/react/LexicalComposer";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import type { EditorState, SerializedEditorState } from "lexical";

import { editorTheme } from "@/components/editor/themes/editor-theme";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { nodes } from "./nodes";
import { Plugins } from "./plugins";

const editorConfig: InitialConfigType = {
	namespace: "Editor",
	theme: editorTheme,
	nodes,
	onError: (error: Error) => {
		console.error(error);
	},
};

export function Editor({
	editorState,
	editorSerializedState,
	className,
	onChange,
	onSerializedChange,
	placeholder,
}: {
	editorState?: EditorState;
	editorSerializedState?: SerializedEditorState;
	className?: string;
	onChange?: (editorState: EditorState) => void;
	onSerializedChange?: (editorSerializedState: SerializedEditorState) => void;
	placeholder?: string;
}) {
	return (
		<div className={cn("overflow-hidden", className)}>
			<LexicalComposer
				initialConfig={{
					...editorConfig,
					...(editorState ? { editorState } : {}),
					...(editorSerializedState?.root
						? { editorState: JSON.stringify(editorSerializedState) }
						: {}),
				}}
			>
				<TooltipProvider>
					<Plugins placeholder={placeholder} />

					<OnChangePlugin
						ignoreSelectionChange={true}
						onChange={(editorState) => {
							onChange?.(editorState);
							onSerializedChange?.(editorState.toJSON());
						}}
					/>
				</TooltipProvider>
			</LexicalComposer>
		</div>
	);
}
