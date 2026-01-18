import type { EditorThemeClasses } from "lexical";

import "./editor-theme.css";

export const editorTheme: EditorThemeClasses = {
	ltr: "text-left",
	rtl: "text-right",
	heading: {
		h1: "text-3xl font-bold tracking-tight mt-6 mb-3 first:mt-0",
		h2: "text-2xl font-semibold tracking-tight mt-5 mb-2 first:mt-0",
		h3: "text-xl font-semibold tracking-tight mt-4 mb-2",
		h4: "text-lg font-semibold tracking-tight mt-3 mb-1",
		h5: "text-base font-semibold tracking-tight mt-2 mb-1",
		h6: "text-sm font-semibold tracking-tight mt-2 mb-1",
	},
	paragraph: "leading-relaxed my-1",
	quote:
		"border-l-2 border-muted-foreground/30 pl-3 italic my-2 text-muted-foreground",
	link: "text-editor-entity hover:underline hover:cursor-pointer",
	list: {
		checklist: "relative",
		listitem: "ml-5",
		listitemChecked:
			'relative list-none outline-none opacity-60 line-through before:content-[""] before:size-4 before:top-0.5 before:left-[-1.25rem] before:cursor-pointer before:block before:absolute before:border before:border-input before:rounded-[4px] before:bg-primary before:transition-colors after:content-[""] after:cursor-pointer after:border-primary-foreground after:border-solid after:absolute after:block after:top-[7px] after:w-[3px] after:left-[-13px] after:h-[6px] after:rotate-45 after:border-r-2 after:border-b-2',
		listitemUnchecked:
			'relative list-none outline-none before:content-[""] before:size-4 before:top-0.5 before:left-[-1.25rem] before:cursor-pointer before:block before:absolute before:border before:border-input before:rounded-[4px] before:transition-colors hover:before:border-ring',
		nested: {
			listitem: "list-none before:hidden after:hidden",
		},
		ol: "m-0 p-0 list-decimal",
		olDepth: [
			"list-outside !list-decimal",
			"list-outside !list-[upper-roman]",
			"list-outside !list-[lower-roman]",
			"list-outside !list-[upper-alpha]",
			"list-outside !list-[lower-alpha]",
		],
		ul: "m-0 p-0 list-outside",
		ulDepth: [
			"list-outside !list-disc",
			"list-outside !list-circle",
			"list-outside !list-square",
			"list-outside !list-disc",
			"list-outside !list-circle",
		],
	},
	hashtag: "text-editor-tag bg-editor-tag/10 rounded px-1",
	text: {
		bold: "font-semibold",
		code: "bg-muted px-1 py-0.5 rounded text-sm font-mono",
		italic: "italic",
		strikethrough: "line-through opacity-60",
		subscript: "sub",
		superscript: "sup",
		underline: "underline underline-offset-2",
		underlineStrikethrough: "[text-decoration:underline_line-through]",
	},
	image:
		"relative inline-block user-select-none cursor-default editor-image my-2",
	inlineImage:
		"relative inline-block user-select-none cursor-default inline-editor-image",
	keyword: "text-editor-keyword font-semibold",
	code: "EditorTheme__code",
	codeHighlight: {
		atrule: "EditorTheme__tokenSpecial",
		attr: "EditorTheme__tokenAttr",
		boolean: "EditorTheme__tokenConstant",
		builtin: "EditorTheme__tokenFunction",
		cdata: "EditorTheme__tokenComment",
		char: "EditorTheme__tokenString",
		class: "EditorTheme__tokenFunction",
		"class-name": "EditorTheme__tokenFunction",
		comment: "EditorTheme__tokenComment",
		constant: "EditorTheme__tokenConstant",
		deleted: "EditorTheme__tokenProperty",
		doctype: "EditorTheme__tokenComment",
		entity: "EditorTheme__tokenOperator",
		function: "EditorTheme__tokenFunction",
		important: "EditorTheme__tokenSpecial",
		inserted: "EditorTheme__tokenSelector",
		keyword: "EditorTheme__tokenKeyword",
		namespace: "EditorTheme__tokenVariable",
		number: "EditorTheme__tokenConstant",
		operator: "EditorTheme__tokenOperator",
		prolog: "EditorTheme__tokenComment",
		property: "EditorTheme__tokenProperty",
		punctuation: "EditorTheme__tokenPunctuation",
		regex: "EditorTheme__tokenRegex",
		selector: "EditorTheme__tokenSelector",
		string: "EditorTheme__tokenString",
		symbol: "EditorTheme__tokenConstant",
		tag: "EditorTheme__tokenTag",
		url: "EditorTheme__tokenOperator",
		variable: "EditorTheme__tokenVariable",
	},
	characterLimit: "!bg-destructive/50",
	table: "EditorTheme__table w-fit overflow-scroll border-collapse my-3",
	tableCell:
		'EditorTheme__tableCell w-24 relative border border-border px-2 py-1 text-left [&[align=center]]:text-center [&[align=right]]:text-right"',
	tableCellActionButton:
		"EditorTheme__tableCellActionButton bg-background block border-0 rounded-md w-4 h-4 text-foreground cursor-pointer",
	tableCellActionButtonContainer:
		"EditorTheme__tableCellActionButtonContainer block right-0.5 top-0.5 absolute z-10 w-4 h-4",
	tableCellEditing: "EditorTheme__tableCellEditing rounded-sm shadow-sm",
	tableCellHeader:
		"EditorTheme__tableCellHeader bg-muted/50 border border-border px-2 py-1 text-left font-semibold [&[align=center]]:text-center [&[align=right]]:text-right",
	tableCellPrimarySelected:
		"EditorTheme__tableCellPrimarySelected border border-primary border-solid block h-[calc(100%-2px)] w-[calc(100%-2px)] absolute -left-[1px] -top-[1px] z-10",
	tableCellResizer:
		"EditorTheme__tableCellResizer absolute -right-1 h-full w-2 cursor-ew-resize z-10 top-0",
	tableCellSelected: "EditorTheme__tableCellSelected bg-muted/30",
	tableCellSortedIndicator:
		"EditorTheme__tableCellSortedIndicator block opacity-50 absolute bottom-0 left-0 w-full h-0.5 bg-muted",
	tableResizeRuler:
		"EditorTheme__tableCellResizeRuler block absolute w-[1px] h-full bg-primary top-0",
	tableRowStriping:
		"EditorTheme__tableRowStriping m-0 border-t p-0 even:bg-muted/20",
	tableSelected: "EditorTheme__tableSelected ring-1 ring-primary",
	tableSelection: "EditorTheme__tableSelection bg-transparent",
	layoutItem: "border border-dashed border-border px-3 py-2",
	layoutContainer: "grid gap-2 my-2 mx-0",
	autocomplete: "text-muted-foreground",
	blockCursor: "",
	embedBlock: {
		base: "user-select-none",
		focus: "ring-1 ring-primary",
	},
	hr: 'p-0 border-none my-3 mx-0 cursor-pointer after:content-[""] after:block after:h-px after:bg-border selected:ring-1 selected:ring-primary selected:user-select-none',
	indent: "[--lexical-indent-base-value:24px]",
	mark: "",
	markOverlap: "",
};
