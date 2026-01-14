import { zodResolver } from "@hookform/resolvers/zod";
import { env } from "@meraki/env/web";
import {
	IconBrandGithubFilled,
	IconBrandGoogleFilled,
	IconEye,
	IconEyeOff,
	IconLoader2,
} from "@tabler/icons-react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	Field,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
	FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { usePending } from "@/components/ui/pending";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

const signUpSchema = z
	.object({
		name: z.string().min(2, "Name must be at least 2 characters"),
		email: z.email("Invalid email address"),
		password: z.string().min(8, "Password must be at least 8 characters"),
		confirmPassword: z
			.string()
			.min(8, "Password must be at least 8 characters"),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	});

type SignUpValues = z.infer<typeof signUpSchema>;

export default function SignUpForm({
	className,
	...props
}: React.ComponentProps<"div">) {
	const navigate = useNavigate();
	const form = useForm<SignUpValues>({
		resolver: zodResolver(signUpSchema),
		defaultValues: {
			name: "",
			email: "",
			password: "",
			confirmPassword: "",
		},
	});

	const [isSubmitting, setIsSubmitting] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const { pendingProps, isPending } = usePending({ isPending: isSubmitting });

	const handleSocialSignIn = async (provider: "google" | "github") => {
		await authClient.signIn.social({
			provider,
			callbackURL: `${env.VITE_BASE_URL}/dashboard`,
		});
	};

	const onSubmit = async (data: SignUpValues) => {
		setIsSubmitting(true);
		toast.promise(
			(async () => {
				const { data: resData, error } = await authClient.signUp.email({
					email: data.email,
					password: data.password,
					name: data.name,
					callbackURL: `${env.VITE_BASE_URL}/dashboard`,
				});

				if (error) {
					setIsSubmitting(false);
					throw error;
				}

				navigate({ to: "/onboarding/workspace" });
				return resData;
			})(),
			{
				loading: "Creating account...",
				success:
					"Signed up successfully. Please check your email for verification.",
				error: (error) => error.message || "Failed to sign up",
			},
		);
	};

	return (
		<div className={cn("flex flex-col gap-6", className)} {...props}>
			<Card className="p-0">
				<CardContent className="p-0">
					<form className="p-6 md:p-8" onSubmit={form.handleSubmit(onSubmit)}>
						<FieldGroup>
							<div className="flex flex-col items-center gap-2 text-center">
								<h1 className="font-bold text-2xl">Create your account</h1>
								<p className="text-balance text-muted-foreground text-sm">
									Enter your email below to create your account
								</p>
							</div>

							<Field>
								<FieldLabel htmlFor="name">Name</FieldLabel>
								<Controller
									control={form.control}
									name="name"
									render={({ field, fieldState }) => (
										<>
											<Input
												{...field}
												id="name"
												disabled={isPending}
												placeholder="John Doe"
											/>
											{fieldState.error && (
												<FieldError errors={[fieldState.error]} />
											)}
										</>
									)}
								/>
							</Field>

							<Field>
								<FieldLabel htmlFor="email">Email</FieldLabel>
								<Controller
									control={form.control}
									name="email"
									render={({ field, fieldState }) => (
										<>
											<Input
												{...field}
												id="email"
												type="email"
												disabled={isPending}
												placeholder="m@example.com"
											/>
											{fieldState.error && (
												<FieldError errors={[fieldState.error]} />
											)}
										</>
									)}
								/>
								<FieldDescription>
									We&apos;ll use this to contact you. We will not share your
									email with anyone else.
								</FieldDescription>
							</Field>

							<Field>
								<Field className="grid grid-cols-2 gap-4">
									<Field>
										<FieldLabel htmlFor="password">Password</FieldLabel>
										<Controller
											control={form.control}
											name="password"
											render={({ field, fieldState }) => (
												<>
													<div className="relative">
														<Input
															{...field}
															id="password"
															type={showPassword ? "text" : "password"}
															disabled={isPending}
															autoComplete="new-password"
														/>
														<button
															type="button"
															onClick={() => setShowPassword(!showPassword)}
															className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground"
														>
															{showPassword ? (
																<IconEyeOff size={16} />
															) : (
																<IconEye size={16} />
															)}
														</button>
													</div>
													{fieldState.error && (
														<FieldError errors={[fieldState.error]} />
													)}
												</>
											)}
										/>
									</Field>
									<Field>
										<FieldLabel htmlFor="confirm-password">
											Confirm Password
										</FieldLabel>
										<Controller
											control={form.control}
											name="confirmPassword"
											render={({ field, fieldState }) => (
												<>
													<div className="relative">
														<Input
															{...field}
															id="confirm-password"
															type={showConfirmPassword ? "text" : "password"}
															disabled={isPending}
															autoComplete="new-password"
														/>
														<button
															type="button"
															onClick={() =>
																setShowConfirmPassword(!showConfirmPassword)
															}
															className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground"
														>
															{showConfirmPassword ? (
																<IconEyeOff size={16} />
															) : (
																<IconEye size={16} />
															)}
														</button>
													</div>
													{fieldState.error && (
														<FieldError errors={[fieldState.error]} />
													)}
												</>
											)}
										/>
									</Field>
								</Field>
								<FieldDescription>
									Must be at least 8 characters long.
								</FieldDescription>
							</Field>

							<Field>
								<Button type="submit" disabled={isPending} {...pendingProps}>
									{isPending && <IconLoader2 className="size-4 animate-spin" />}
									{isPending ? "Creating..." : "Create Account"}
								</Button>
							</Field>
							<FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
								Or continue with
							</FieldSeparator>
							<Field className="grid grid-cols-2 gap-4">
								<Button
									variant="outline"
									type="button"
									disabled={isPending}
									{...pendingProps}
									onClick={() => handleSocialSignIn("github")}
								>
									<IconBrandGithubFilled className="mr-2 h-4 w-4" />
									Github
								</Button>
								<Button
									variant="outline"
									type="button"
									disabled={isPending}
									{...pendingProps}
									onClick={() => handleSocialSignIn("google")}
								>
									<IconBrandGoogleFilled className="mr-2 h-4 w-4" />
									Google
								</Button>
							</Field>
							<FieldDescription className="text-center">
								Already have an account?{" "}
								<Link to="/sign-in" className="text-primary hover:underline">
									Sign in
								</Link>
							</FieldDescription>
						</FieldGroup>
					</form>
				</CardContent>
			</Card>
			<FieldDescription className="px-6 text-center">
				By clicking continue, you agree to our{" "}
				<Link to="/tos">Terms of Service</Link> and{" "}
				<Link to="/privacy">Privacy Policy</Link>.
			</FieldDescription>
		</div>
	);
}
