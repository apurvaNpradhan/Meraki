import { createFileRoute } from "@tanstack/react-router";
import SettingLayout from "@/components/layout/setting-layout";
import { PreferencesForm } from "@/features/settings/components/preferences-form";

export const Route = createFileRoute(
	"/(authenicated)/settings/account/preferences/",
)({
	component: RouteComponent,
	head: () => ({
		meta: [
			{
				name: "description",
				content: "Preferences",
			},
			{
				title: "Preferences",
			},
		],
	}),
});

function RouteComponent() {
	return (
		<SettingLayout>
			<div className="mx-auto mt-15 flex max-w-4xl flex-col gap-7 p-6">
				<span className="font-bold text-3xl">Preferences</span>
				<PreferencesForm />
			</div>
		</SettingLayout>
	);
}
