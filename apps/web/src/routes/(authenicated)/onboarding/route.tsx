import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { sessionQueryOptions } from "@/lib/auth-client";

export const Route = createFileRoute("/(authenicated)/onboarding")({
	component: RouteComponent,
	beforeLoad: async ({ context, location }) => {
		const session =
			await context.queryClient.ensureQueryData(sessionQueryOptions);
		if (session.data?.user.onboardingCompleted) {
			redirect({
				to: "/dashboard",
				throw: true,
			});
		}
	},
});

function RouteComponent() {
	return <Outlet />;
}
