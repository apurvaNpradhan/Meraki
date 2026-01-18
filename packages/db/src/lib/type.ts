export type SerializedLexicalNode = {
	type: string;
	version: number;
	[key: string]: unknown;
};

export type SerializedRootNode = SerializedLexicalNode & {
	children: SerializedLexicalNode[];
	direction: "ltr" | "rtl" | null;
	format: "left" | "start" | "center" | "right" | "end" | "justify" | "";
	indent: number;
	textFormat?: number;
	textStyle?: string;
};

export type SerializedEditorState = {
	root: SerializedRootNode;
};
