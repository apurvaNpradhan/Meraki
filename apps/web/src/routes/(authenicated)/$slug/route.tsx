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

		if (!session) {
			throw redirect({ to: "/" });
		}

		const targetWorkspace = workspaces?.find((w) => w.slug === slug);
		if (!targetWorkspace) {
			throw redirect({
				to: "/",
			});
		}

		const currentActiveId = session.session.activeOrganization?.id;
		const customActiveId = session.session.activeOrganization?.id;

		const isActive =
			currentActiveId === targetWorkspace.id ||
			customActiveId === targetWorkspace.id;

		if (!isActive) {
			const { error } = await authClient.organization.setActive({
				organizationId: targetWorkspace.id,
			});

			if (!error) {
				await queryClient.invalidateQueries({
					queryKey: sessionQueryOptions.queryKey,
				});
				await queryClient.refetchQueries({
					queryKey: sessionQueryOptions.queryKey,
				});
			}
		}

		return {
			workspace: targetWorkspace,
		};
	},
	loader: ({ context }) => {
		const { workspace } = context;
		return { workspace };
	},
	component: RouteComponent,
});

function RouteComponent() {
	return <Outlet />;
}
