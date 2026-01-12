import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import {
	authClient,
	sessionQueryOptions,
	workspacesQueryOptions,
} from "@/lib/auth-client";

export const Route = createFileRoute("/(authenicated)/$slug")({
	beforeLoad: async ({ params, context }) => {
		const { slug } = params;
		const { queryClient } = context;

		const [workspacesResponse, sessionResponse] = await Promise.all([
			queryClient.ensureQueryData(workspacesQueryOptions),
			queryClient.ensureQueryData(sessionQueryOptions),
		]);
		const workspaces = workspacesResponse.data;
		const session = sessionResponse.data;
		const currentWorkspace = workspaces?.find((w) => w.slug === slug);
		if (!currentWorkspace) {
			throw redirect({
				to: "/",
			});
		}

		if (session?.session.activeOrganizationId !== currentWorkspace.id) {
			const { data: updatedSession } = await authClient.organization.setActive({
				organizationId: currentWorkspace.id,
			});

			if (updatedSession) {
				queryClient.setQueryData(sessionQueryOptions.queryKey, {
					data: updatedSession,
					error: null,
				});
			}

			queryClient.invalidateQueries({
				queryKey: sessionQueryOptions.queryKey,
			});
		}

		return {
			workspace: currentWorkspace,
		};
	},
	component: RouteComponent,
});

function RouteComponent() {
	return <Outlet />;
}
