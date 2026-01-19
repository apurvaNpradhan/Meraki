import { useEffect, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { useDebouncedCallback } from "use-debounce";
import ContentEditor from "@/components/editor/editors/content-editor";
import { IconAndColorPicker } from "@/components/icon-and-colorpicker";
import { useSpace, useUpdateSpace } from "@/features/spaces/hooks/use-space";

export function SpaceOverview({ id }: { id: string }) {
	const { data } = useSpace(id);
	const updateSpace = useUpdateSpace();

	const [name, setName] = useState("");
	const [_color, setColor] = useState("");

	useEffect(() => {
		if (!data) return;
		setName(data.name ?? "");
		setColor(data.colorCode ?? "");
	}, [data]);

	const debouncedUpdateName = useDebouncedCallback((value: string) => {
		updateSpace.mutate({
			spacePublicId: id,
			input: { name: value },
		});
	}, 600);

	const debouncedUpdateColor = useDebouncedCallback((value: string) => {
		updateSpace.mutate({
			spacePublicId: id,
			input: { colorCode: value },
		});
	}, 600);
	const [_isHovered, _setIsHovered] = useState(false);

	if (!data) return null;

	return (
		<div className="container mt-10 flex flex-col gap-4">
			<IconAndColorPicker
				icon={data.icon}
				color={data.colorCode}
				variant="soft"
				iconSize={30}
				onIconChange={(icon) =>
					updateSpace.mutate({
						spacePublicId: id,
						input: { icon },
					})
				}
				onColorChange={(color) => {
					setColor(color);
					debouncedUpdateColor(color);
				}}
			/>
			<div className="relative flex flex-row items-start gap-2">
				<TextareaAutosize
					value={name}
					onChange={(e) => {
						setName(e.target.value);
						debouncedUpdateName(e.target.value);
					}}
					placeholder="Name"
					className="w-full resize-none bg-transparent px-0 font-semibold text-3xl text-foreground outline-none placeholder:text-muted-foreground"
				/>
			</div>
			<div className="flex flex-row gap-2">
				<span className="font-semibold text-muted-foreground">
					{data.projectCount} Projects
				</span>
				<span className="font-semibold text-muted-foreground">
					{data.taskCount} Tasks
				</span>
			</div>
			<div>
				<ContentEditor
					key={id}
					initialContent={data?.description ?? undefined}
					placeholder="Description..."
					className="text-primary/70"
					onUpdate={(content) => {
						updateSpace.mutate({
							spacePublicId: id,
							input: { description: content },
						});
					}}
				/>
			</div>
		</div>
	);
}
