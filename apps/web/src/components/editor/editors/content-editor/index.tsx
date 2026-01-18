import type { SerializedEditorState } from "lexical";
import { useDebouncedCallback } from "use-debounce";
import { Editor } from "@/components/editor/editors/content-editor/editor";
import { cn } from "@/lib/utils";

interface ContentEditorProps {
	initialContent?: SerializedEditorState;
	className?: string;
	placeholder?: string;
	onUpdate?: (content: SerializedEditorState) => void;
}

const ContentEditor = ({
	initialContent,
	onUpdate,
	placeholder,
	className,
}: ContentEditorProps) => {
	const debouncedUpdateContent = useDebouncedCallback(
		(content: SerializedEditorState) => {
			onUpdate?.(content);
		},
		1000,
	);

	return (
		<Editor
			editorSerializedState={initialContent}
			className={cn("h-full w-full", className)}
			onSerializedChange={debouncedUpdateContent}
			placeholder={placeholder}
		/>
	);
};

export default ContentEditor;
