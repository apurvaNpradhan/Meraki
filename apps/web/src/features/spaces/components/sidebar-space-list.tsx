import {
	closestCenter,
	DndContext,
	type DragEndEvent,
	PointerSensor,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import {
	arrayMove,
	SortableContext,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { generateKeyBetween } from "fractional-indexing";
import { Suspense, useEffect, useState } from "react";
import {
	SidebarGroupContent,
	SidebarMenu,
	SidebarMenuSkeleton,
} from "@/components/ui/sidebar";
import type { SidebarSpace } from "@/types/space";
import { useSpaces, useUpdateSpace } from "../hooks/use-space";
import SortableSidebarSpaceItem from "./sortable-sidebar-space-item";

export function SidebarSpaceList() {
	const { data: spaces } = useSpaces();
	const updateSpace = useUpdateSpace();
	const [items, setItems] = useState<SidebarSpace[]>([]);

	useEffect(() => {
		if (!spaces) return;
		setItems(spaces as SidebarSpace[]);
	}, [spaces]);

	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 8,
			},
		}),
	);

	const handleDragEnd = ({ active, over }: DragEndEvent) => {
		if (!over || active.id === over.id) return;

		const oldIndex = items.findIndex(
			(i: SidebarSpace) => i.publicId === active.id,
		);
		const newIndex = items.findIndex(
			(i: SidebarSpace) => i.publicId === over.id,
		);

		const reordered = arrayMove(items, oldIndex, newIndex);
		setItems(reordered);

		const prev = reordered[newIndex - 1]?.position;
		const next = reordered[newIndex + 1]?.position;

		updateSpace.mutate({
			spacePublicId: String(active.id),
			input: {
				position: generateKeyBetween(prev, next),
			},
		});
	};

	return (
		<SidebarGroupContent>
			<SidebarMenu>
				<Suspense
					fallback={
						<div>
							<SidebarMenuSkeleton />
						</div>
					}
				>
					<DndContext
						sensors={sensors}
						collisionDetection={closestCenter}
						onDragEnd={handleDragEnd}
					>
						<SortableContext
							items={items.map((i) => i.publicId)}
							strategy={verticalListSortingStrategy}
						>
							{items.map((space) => (
								<SortableSidebarSpaceItem key={space.publicId} data={space} />
							))}
						</SortableContext>
					</DndContext>
				</Suspense>
			</SidebarMenu>
		</SidebarGroupContent>
	);
}
