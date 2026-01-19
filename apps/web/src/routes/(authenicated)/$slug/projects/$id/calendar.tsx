import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
	"/(authenicated)/$slug/projects/$id/calendar",
)({
	component: () => <div>Calendar view placeholder</div>,
});
