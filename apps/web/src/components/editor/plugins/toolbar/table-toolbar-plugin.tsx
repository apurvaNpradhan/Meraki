"use client";

import { IconTable } from "@tabler/icons-react";

import { useToolbarContext } from "@/components/editor/context/toolbar-context";
import { InsertTableDialog } from "@/components/editor/plugins/table-plugin";
import { Button } from "@/components/ui/button";

export function TableToolbarPlugin() {
	const { activeEditor, showModal } = useToolbarContext();

	return (
		<Button
			onClick={() =>
				showModal("Insert Table", (onClose) => (
					<InsertTableDialog activeEditor={activeEditor} onClose={onClose} />
				))
			}
			size={"icon-sm"}
			variant={"outline"}
			className=""
		>
			<IconTable className="size-4" />
		</Button>
	);
}
