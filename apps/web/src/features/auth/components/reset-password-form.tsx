import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Field,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

const formSchema = z
	.object({
		password: z.string().min(8, "Password must be at least 8 characters"),
		confirmPassword: z
			.string()
			.min(8, "Password must be at least 8 characters"),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	});

export function ResetPasswordForm({
	className,
	...props
}: React.ComponentProps<"div">) {
	const navigate = useNavigate();
	const { token } = useSearch({ from: "/(sign)/reset-password" });

	const [isLoading, setIsLoading] = useState(false);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			password: "",
			confirmPassword: "",
		},
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		setIsLoading(true);

		const { error } = await authClient.resetPassword({
			newPassword: values.password,
			token: token as string,
		});

		if (error) {
			toast.error(error.message);
		} else {
			toast.success("Password reset successfully");
			navigate({ to: "/sign-in" });
		}

		setIsLoading(false);
	}

	return (
		<div className={cn("flex flex-col gap-6", className)} {...props}>
			<Card>
				<CardHeader className="text-center">
					<CardTitle className="text-xl">Reset Password</CardTitle>
					<CardDescription>Enter your new password</CardDescription>
				</CardHeader>
				<CardContent>
					<form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
						<FieldGroup>
							<Field>
								<FieldLabel htmlFor="password">Password</FieldLabel>
								<Controller
									control={form.control}
									name="password"
									render={({ field, fieldState }) => (
										<>
											<Input {...field} id="password" type="password" />
											{fieldState.error && (
												<FieldError errors={[fieldState.error]} />
											)}
										</>
									)}
								/>
							</Field>
							<Field>
								<FieldLabel htmlFor="confirmPassword">
									Confirm Password
								</FieldLabel>
								<Controller
									control={form.control}
									name="confirmPassword"
									render={({ field, fieldState }) => (
										<>
											<Input {...field} id="confirmPassword" type="password" />
											{fieldState.error && (
												<FieldError errors={[fieldState.error]} />
											)}
										</>
									)}
								/>
							</Field>
							<Button className="w-full" disabled={isLoading} type="submit">
								{isLoading ? (
									<Loader2 className="size-4 animate-spin" />
								) : (
									"Reset Password"
								)}
							</Button>
							<div className="text-center text-sm">
								Don&apos;t have an account?{" "}
								<Link to="/sign-up" className="underline underline-offset-4">
									Sign up
								</Link>
							</div>
						</FieldGroup>
					</form>
				</CardContent>
			</Card>
			<FieldDescription className="text-balance text-center">
				By clicking continue, you agree to our{" "}
				<Link to="/tos">Terms of Service</Link> and{" "}
				<Link to="/privacy">Privacy Policy</Link>.
			</FieldDescription>
		</div>
	);
}
