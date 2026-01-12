import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { sessionQueryOptions } from "@/lib/auth-client";

export const Route = createFileRoute("/(authenicated)")({
	component: RouteComponent,
	beforeLoad: async ({ context, location }) => {
		const session =
			await context.queryClient.ensureQueryData(sessionQueryOptions);

		if (!session.data) {
			redirect({
				to: "/sign-in",
				throw: true,
			});
		} else if (
			session.data?.user.onboardingCompleted === null &&
			location.pathname.startsWith("/onboarding") === false
		) {
			redirect({
				to: "/onboarding/complete",
				throw: true,
			});
		}

		return { session };
	},
});

function RouteComponent() {
	return <Outlet />;
}
