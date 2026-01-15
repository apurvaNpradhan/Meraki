import { zodResolver } from "@hookform/resolvers/zod";
import { InsertTaskInput } from "@meraki/api/types";
import { IconLoader2 } from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { PrioritySelector } from "@/components/priority-selector";
import { StatusSelector } from "@/components/status-selector";
import { AutosizeTextarea } from "@/components/ui/autosize-textarea";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	ResponsiveModalFooter,
	ResponsiveModalHeader,
	ResponsiveModalTitle,
} from "@/components/ui/responsive-modal";
import { Switch } from "@/components/ui/switch";
import { useModal } from "@/stores/modal.store";
import { orpc, queryClient } from "@/utils/orpc";
import { TaskDatePicker } from "./task-date-picker";

type TaskFormValues = z.input<typeof InsertTaskInput>;

export function NewTaskModal() {
	const { close } = useModal();
	const [createMore, setCreateMore] = useState(false);
	const createTask = useMutation(
		orpc.task.create.mutationOptions({
			onSuccess: () => {
				queryClient.invalidateQueries(orpc.task.all.queryOptions());
				if (!createMore) {
					toast.success("Task created successfully");
					close();
				}
				form.reset(defaultValues);
			},
			onError: (error: Error) => {
				toast.error(error.message || "Failed to create task");
			},
		}),
	);
	const defaultValues: TaskFormValues = {
		title: "",
		description: "",
		status: "todo",
		priority: 0,
	};
	const form = useForm<TaskFormValues>({
		resolver: zodResolver(InsertTaskInput),
		defaultValues: {
			title: "",
			description: "",
			status: "todo",
			priority: 0,
		},
	});

	const onSubmit = (values: TaskFormValues) => {
		createTask.mutate({
			input: values,
		});
	};

	return (
		<div className="flex w-full flex-col gap-6 p-1">
			<ResponsiveModalHeader>
				<ResponsiveModalTitle className="sr-only">
					Create New Task
				</ResponsiveModalTitle>
			</ResponsiveModalHeader>

			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="flex flex-col space-y-4"
			>
				<div className="space-y-1">
					<Controller
						control={form.control}
						name="title"
						render={({ field, fieldState }) => (
							<div className="space-y-1">
								<Input
									{...field}
									placeholder="Task name"
									className="h-auto border-none p-0 font-bold font-heading text-3xl shadow-none placeholder:text-muted-foreground/30 focus-visible:ring-0 md:text-4xl dark:bg-transparent"
									autoFocus
									onKeyDown={(e) => {
										if (e.key === "Enter") {
											e.preventDefault();
										}
									}}
								/>
								{fieldState.error && <FieldError errors={[fieldState.error]} />}
							</div>
						)}
					/>
					<Controller
						control={form.control}
						name="description"
						render={({ field }) => (
							<AutosizeTextarea
								placeholder="Description..."
								{...field}
								value={field.value ?? ""}
								className="min-h-[20px] resize-none border-none bg-transparent px-0 text-lg text-muted-foreground shadow-none focus-visible:ring-0"
							/>
						)}
					/>
				</div>

				<div className="flex flex-row items-center gap-2 px-1">
					<Controller
						control={form.control}
						name="deadline"
						render={({ field }) => (
							<TaskDatePicker
								date={field.value ? new Date(field.value) : undefined}
								className="w-fit"
								onSelect={(date) => field.onChange(date)}
							/>
						)}
					/>
					<Controller
						control={form.control}
						name="priority"
						render={({ field }) => (
							<PrioritySelector
								className="w-fit"
								value={field.value ?? 0}
								onPriorityChange={field.onChange}
							/>
						)}
					/>
					<Controller
						control={form.control}
						name="status"
						render={({ field }) => (
							<StatusSelector
								className="w-fit"
								value={field.value}
								onStatusChange={field.onChange}
							/>
						)}
					/>
				</div>

				<ResponsiveModalFooter className="mt-6 flex items-center justify-end gap-3 border-t pt-4">
					<div className="flex items-center space-x-2">
						<Switch
							id="create-more"
							checked={createMore}
							onCheckedChange={setCreateMore}
						/>
						<Label htmlFor="create-more"> Create more</Label>
					</div>
					<Button
						type="button"
						variant="ghost"
						onClick={close}
						disabled={createTask.isPending}
					>
						Cancel
					</Button>
					<Button
						type="submit"
						disabled={createTask.isPending}
						className="min-w-[100px]"
					>
						{createTask.isPending ? (
							<>
								<IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
								Adding...
							</>
						) : (
							"Add task"
						)}
					</Button>
				</ResponsiveModalFooter>
			</form>
		</div>
	);
}

export default NewTaskModal;
