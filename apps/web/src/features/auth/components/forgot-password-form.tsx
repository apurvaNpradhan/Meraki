import { zodResolver } from "@hookform/resolvers/zod";
import { env } from "@meraki/env/web";
import { IconLoader2 } from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
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

const formSchema = z.object({
	email: z.string().email(),
});

export function ForgotPasswordForm({
	className,
	...props
}: React.ComponentProps<"div">) {
	const [isLoading, setIsLoading] = useState(false);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: "",
		},
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		setIsLoading(true);

		const { error } = await authClient.requestPasswordReset({
			email: values.email,
			redirectTo: `${env.VITE_BASE_URL}/reset-password`,
		});

		if (error) {
			toast.error(error.message);
		} else {
			toast.success("Password reset email sent");
		}

		setIsLoading(false);
	}

	return (
		<div className={cn("flex flex-col gap-6", className)} {...props}>
			<Card>
				<CardHeader className="text-center">
					<CardTitle className="text-xl">Forgot Password</CardTitle>
					<CardDescription>
						Enter your email to reset your password
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
						<FieldGroup>
							<Field>
								<FieldLabel htmlFor="email">Email</FieldLabel>
								<Controller
									control={form.control}
									name="email"
									render={({ field, fieldState }) => (
										<>
											<Input
												placeholder="m@example.com"
												{...field}
												id="email"
												type="email"
											/>
											{fieldState.error && (
												<FieldError errors={[fieldState.error]} />
											)}
										</>
									)}
								/>
							</Field>
							<Button className="w-full" disabled={isLoading} type="submit">
								{isLoading ? (
									<IconLoader2 className="size-4 animate-spin" />
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
