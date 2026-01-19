import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/(authenicated)/$slug/spaces/$id/")({
	loader: ({ params }) => {
		throw redirect({
			to: "/$slug/spaces/$id/overview",
			params,
		});
	},
});
