import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/(authenicated)/$slug/projects/$id/")({
	loader: ({ params }) => {
		throw redirect({
			to: "/$slug/projects/$id/overview",
			params,
		});
	},
});
