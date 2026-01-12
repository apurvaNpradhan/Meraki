import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { sessionQueryOptions } from "@/lib/auth-client";

export const Route = createFileRoute("/(sign)")({
	component: RouteComponent,
	beforeLoad: async ({ context, location }) => {
		const session =
			await context.queryClient.ensureQueryData(sessionQueryOptions);
		if (session.data) {
			if (session.data.user.onboardingCompleted === null) {
				redirect({
					to: "/onboarding/complete",
					throw: true,
				});
			}
			redirect({
				to: "/dashboard",
				throw: true,
			});
		}
		return { session };
	},
});

function RouteComponent() {
	return <Outlet />;
}
