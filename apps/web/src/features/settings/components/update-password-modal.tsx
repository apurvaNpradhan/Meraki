import { zodResolver } from "@hookform/resolvers/zod";
import { IconEye, IconEyeOff, IconLoader2 } from "@tabler/icons-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	ResponsiveModalDescription,
	ResponsiveModalFooter,
	ResponsiveModalHeader,
	ResponsiveModalTitle,
} from "@/components/ui/responsive-modal";
import { authClient } from "@/lib/auth-client";
import { useModal } from "@/stores/modal.store";

const passwordSchema = z
	.object({
		currentPassword: z.string().min(1, "Current password is required"),
		newPassword: z.string().min(8, "Password must be at least 8 characters"),
		confirmPassword: z.string().min(1, "Please confirm your password"),
	})
	.refine((data) => data.newPassword === data.confirmPassword, {
		message: "Passwords don't match",
		path: ["confirmPassword"],
	});

type PasswordFormValues = z.infer<typeof passwordSchema>;

export function UpdatePasswordModal() {
	const { close } = useModal();
	const [isLoading, setIsLoading] = useState(false);
	const [showCurrentPassword, setShowCurrentPassword] = useState(false);
	const [showNewPassword, setShowNewPassword] = useState(false);

	const form = useForm<PasswordFormValues>({
		resolver: zodResolver(passwordSchema),
		defaultValues: {
			currentPassword: "",
			newPassword: "",
			confirmPassword: "",
		},
	});

	async function onSubmit(values: PasswordFormValues) {
		setIsLoading(true);
		try {
			const { error } = await authClient.changePassword({
				currentPassword: values.currentPassword,
				newPassword: values.newPassword,
				revokeOtherSessions: true,
			});

			if (error) {
				throw error;
			}

			toast.success("Password updated successfully");
			close();
		} catch (error) {
			const message =
				error instanceof Error ? error.message : "Failed to update password";
			toast.error(message);
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<div className="flex flex-col gap-6 p-1">
			<ResponsiveModalHeader>
				<ResponsiveModalTitle>Update Password</ResponsiveModalTitle>
				<ResponsiveModalDescription>
					Ensure your account is using a long, random password to stay secure.
				</ResponsiveModalDescription>
			</ResponsiveModalHeader>

			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="flex flex-col gap-4"
			>
				<div className="flex flex-col gap-2">
					<label
						htmlFor="currentPassword"
						className="font-medium text-foreground/80 text-sm"
					>
						Current Password
					</label>
					<div className="relative">
						<Input
							id="currentPassword"
							type={showCurrentPassword ? "text" : "password"}
							placeholder="Current password"
							{...form.register("currentPassword")}
							className={
								form.formState.errors.currentPassword
									? "border-destructive"
									: ""
							}
						/>
						<button
							type="button"
							onClick={() => setShowCurrentPassword(!showCurrentPassword)}
							className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground"
						>
							{showCurrentPassword ? (
								<IconEyeOff size={18} />
							) : (
								<IconEye size={18} />
							)}
						</button>
					</div>
					{form.formState.errors.currentPassword && (
						<p className="text-destructive text-xs">
							{form.formState.errors.currentPassword.message}
						</p>
					)}
				</div>

				<div className="flex flex-col gap-2">
					<label
						htmlFor="newPassword"
						className="font-medium text-foreground/80 text-sm"
					>
						New Password
					</label>
					<div className="relative">
						<Input
							id="newPassword"
							type={showNewPassword ? "text" : "password"}
							placeholder="New password"
							{...form.register("newPassword")}
							className={
								form.formState.errors.newPassword ? "border-destructive" : ""
							}
						/>
						<button
							type="button"
							onClick={() => setShowNewPassword(!showNewPassword)}
							className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground"
						>
							{showNewPassword ? (
								<IconEyeOff size={18} />
							) : (
								<IconEye size={18} />
							)}
						</button>
					</div>
					{form.formState.errors.newPassword && (
						<p className="text-destructive text-xs">
							{form.formState.errors.newPassword.message}
						</p>
					)}
				</div>

				<div className="flex flex-col gap-2">
					<label
						htmlFor="confirmPassword"
						className="font-medium text-foreground/80 text-sm"
					>
						Confirm New Password
					</label>
					<Input
						id="confirmPassword"
						type="password"
						placeholder="Confirm password"
						{...form.register("confirmPassword")}
						className={
							form.formState.errors.confirmPassword ? "border-destructive" : ""
						}
					/>
					{form.formState.errors.confirmPassword && (
						<p className="text-destructive text-xs">
							{form.formState.errors.confirmPassword.message}
						</p>
					)}
				</div>

				<ResponsiveModalFooter className="mt-2">
					<Button
						type="button"
						variant="ghost"
						onClick={close}
						disabled={isLoading}
					>
						Cancel
					</Button>
					<Button type="submit" disabled={isLoading}>
						{isLoading ? (
							<>
								<IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
								Updating...
							</>
						) : (
							"Update Password"
						)}
					</Button>
				</ResponsiveModalFooter>
			</form>
		</div>
	);
}
