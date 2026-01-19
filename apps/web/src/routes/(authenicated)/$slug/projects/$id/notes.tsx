import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
	"/(authenicated)/$slug/projects/$id/notes",
)({
	component: () => <div>Notes view placeholder</div>,
});
