import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { sessionQueryOptions, workspacesQueryOptions } from "@/lib/auth-client";

export const Route = createFileRoute("/(authenicated)/onboarding")({
	component: RouteComponent,
	beforeLoad: async ({ context, location }) => {
		const { queryClient } = context;

		const [workspacesResponse, sessionResponse] = await Promise.all([
			queryClient.ensureQueryData(workspacesQueryOptions),
			queryClient.ensureQueryData(sessionQueryOptions),
		]);

		const workspaces = workspacesResponse.data;
		const session = sessionResponse.data;

		if (!session) {
			throw redirect({ to: "/" });
		}

		const targetWorkspace = workspaces?.find(
			(w) => w.slug === session.session.activeOrganization?.slug,
		);
		if (!targetWorkspace) {
			if (
				location.pathname === "/onboarding/workspace" ||
				location.pathname === "/onboarding/complete"
			) {
				return;
			}
			throw redirect({
				to: "/onboarding/workspace",
			});
		}
		throw redirect({
			to: "/$slug/home",
			params: {
				slug: session.session.activeOrganization?.slug ?? "",
			},
			throw: true,
		});
	},
});

function RouteComponent() {
	return <Outlet />;
}
