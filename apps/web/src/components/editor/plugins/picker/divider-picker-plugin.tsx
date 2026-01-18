import { INSERT_HORIZONTAL_RULE_COMMAND } from "@lexical/react/LexicalHorizontalRuleNode";
import { IconSeparator } from "@tabler/icons-react";

import { ComponentPickerOption } from "@/components/editor/plugins/picker/component-picker-option";

export function DividerPickerPlugin() {
	return new ComponentPickerOption("Divider", {
		icon: <IconSeparator className="size-4" />,
		keywords: ["horizontal rule", "divider", "hr"],
		onSelect: (_, editor) =>
			editor.dispatchCommand(INSERT_HORIZONTAL_RULE_COMMAND, undefined),
	});
}
