import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
	"/(authenicated)/$slug/settings/workspace/people",
)({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Hello "/(authenicated)/$slug/settings/workspace/people"!</div>;
}
