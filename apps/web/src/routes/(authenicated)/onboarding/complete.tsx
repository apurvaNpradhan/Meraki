import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useOnboardingStore } from "@/features/onboarding/onboarding.store";
import {
	authClient,
	sessionQueryOptions,
	workspacesQueryOptions,
} from "@/lib/auth-client";

export const Route = createFileRoute("/(authenicated)/onboarding/complete")({
	component: RouteComponent,
});

function RouteComponent() {
	const { queryClient } = Route.useRouteContext();
	const navigate = useNavigate();
	const orgName = useOnboardingStore((state) => state.name);
	const orgSlug = useOnboardingStore((state) => state.slug);
	const form = useForm({});
	const onSubmit = async () => {
		if (!orgName || !orgSlug) {
			navigate({ to: "/onboarding/workspace" });
			return;
		}
		const { data, error } = await authClient.organization.create({
			name: orgName,
			slug: orgSlug,
		});

		if (error) {
			toast.error(error.message);
			return;
		}
		await Promise.all([
			await authClient.updateUser({
				onboardingCompleted: new Date(),
			}),

			await authClient.organization.setActive({
				organizationId: data.id,
			}),

			await queryClient.invalidateQueries({
				queryKey: sessionQueryOptions.queryKey,
			}),
			await queryClient.invalidateQueries({
				queryKey: workspacesQueryOptions.queryKey,
			}),
		]);
		toast.success("Onboarding completed successfully");
		await navigate({
			to: "/$slug/dashboard",
			params: {
				slug: orgSlug,
			},
		});

		useOnboardingStore.setState({
			name: "",
			slug: "",
		});
	};
	useEffect(() => {
		if (!useOnboardingStore.persist.hasHydrated()) return;
		if (!orgName || !orgSlug) {
			navigate({ to: "/onboarding/workspace" });
		}
	}, [orgName, orgSlug, navigate]);
	return (
		<div className="flex h-svh w-full items-center justify-center">
			<Card className="w-full max-w-md">
				<CardContent>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="flex flex-col gap-4"
					>
						<Button
							type="submit"
							className="mt-4 w-full"
							disabled={form.formState.isSubmitting}
						>
							Finish onboarding
						</Button>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
