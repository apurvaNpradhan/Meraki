import { createFileRoute, useLoaderData } from "@tanstack/react-router";
import SettingLayout from "@/components/layout/setting-layout";
import { WorkspaceGeneralSettings } from "@/features/workspaces/components/workspace-general-settings";

export const Route = createFileRoute(
	"/(authenicated)/$slug/settings/workspace/general",
)({
	component: RouteComponent,
	head: () => ({
		meta: [
			{
				name: "description",
				content: "Workspace settings",
			},
			{
				title: "General",
			},
		],
	}),
});

function RouteComponent() {
	const { workspace } = useLoaderData({ from: "/(authenicated)/$slug" });
	return (
		<SettingLayout>
			<div className="mx-auto mt-15 flex max-w-4xl flex-col gap-7 p-6">
				<span className="font-bold text-3xl">Workspace settings</span>
				<WorkspaceGeneralSettings workspace={workspace} />
			</div>
		</SettingLayout>
	);
}
