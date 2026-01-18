"use client";

import { IconPhoto } from "@tabler/icons-react";

import { useToolbarContext } from "@/components/editor/context/toolbar-context";
import { InsertImageDialog } from "@/components/editor/plugins/images-plugin";
import { Button } from "@/components/ui/button";

export function ImageToolbarPlugin() {
	const { activeEditor, showModal } = useToolbarContext();

	return (
		<Button
			onClick={(_e) => {
				showModal("Insert Image", (onClose) => (
					<InsertImageDialog activeEditor={activeEditor} onClose={onClose} />
				));
			}}
			variant={"outline"}
			size={"icon-sm"}
			className=""
		>
			<IconPhoto className="size-4" />
		</Button>
	);
}
