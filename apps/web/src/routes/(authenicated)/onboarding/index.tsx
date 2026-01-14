import { createFileRoute, redirect } from "@tanstack/react-router";
import { sessionQueryOptions } from "@/lib/auth-client";

export const Route = createFileRoute("/(authenicated)/onboarding/")({
	component: RouteComponent,
	beforeLoad: async ({ context }) => {
		const { queryClient } = context;
		const session = await queryClient.ensureQueryData(sessionQueryOptions);
		if (session.data?.user.onboardingCompleted) {
			redirect({
				to: "/onboarding/workspace",
				throw: true,
			});
		}
	},
});

function RouteComponent() {}
