import { createFileRoute } from "@tanstack/react-router";
import SettingLayout from "@/components/layout/setting-layout";
import { AccountSettingsPage } from "@/features/settings/components/account-settings-page";
export const Route = createFileRoute(
	"/(authenicated)/settings/account/profile/",
)({
	component: RouteComponent,
	head: () => ({
		meta: [
			{
				name: "description",
				content: "Account Settings",
			},
			{
				title: "Account Settings",
			},
		],
	}),
});

function RouteComponent() {
	return (
		<SettingLayout>
			<div className="mx-auto mt-15 flex max-w-4xl flex-col gap-7 p-6">
				<span className="font-semibold text-3xl">Account Settings</span>
				<AccountSettingsPage />
			</div>
		</SettingLayout>
	);
}
