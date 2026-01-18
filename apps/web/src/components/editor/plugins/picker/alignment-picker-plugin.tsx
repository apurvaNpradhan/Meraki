import {
	IconAlignCenter,
	IconAlignJustified,
	IconAlignLeft,
	IconAlignRight,
} from "@tabler/icons-react";
import { FORMAT_ELEMENT_COMMAND } from "lexical";

import { ComponentPickerOption } from "@/components/editor/plugins/picker/component-picker-option";

export function AlignmentPickerPlugin({
	alignment,
}: {
	alignment: "left" | "center" | "right" | "justify";
}) {
	return new ComponentPickerOption(`Align ${alignment}`, {
		icon: <AlignIcons alignment={alignment} />,
		keywords: ["align", "justify", alignment],
		onSelect: (_, editor) =>
			editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, alignment),
	});
}

function AlignIcons({
	alignment,
}: {
	alignment: "left" | "center" | "right" | "justify";
}) {
	switch (alignment) {
		case "left":
			return <IconAlignLeft className="size-4" />;
		case "center":
			return <IconAlignCenter className="size-4" />;
		case "right":
			return <IconAlignRight className="size-4" />;
		case "justify":
			return <IconAlignJustified className="size-4" />;
	}
}
