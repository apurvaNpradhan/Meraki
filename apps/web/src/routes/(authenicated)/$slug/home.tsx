import { createFileRoute } from "@tanstack/react-router";
import AppLayout from "@/components/layout/app-layout";
import { SidebarTrigger } from "@/components/ui/sidebar";
export const Route = createFileRoute("/(authenicated)/$slug/home")({
	component: RouteComponent,
	beforeLoad({ context }) {
		const { workspace } = context;
		return { workspace };
	},
});

function RouteComponent() {
	return (
		<AppLayout header={<Header />}>
			<div className="mx-auto w-full max-w-5xl space-y-8 px-4 py-8">
				<div className="flex items-center justify-center">
					<h1 className="font-bold text-3xl tracking-tight">{getGreeting()}</h1>
				</div>
			</div>
		</AppLayout>
	);
}
function Header() {
	return (
		<div className="flex w-full flex-row items-center justify-between border-b px-2 py-1">
			<div className="flex items-center gap-2">
				<SidebarTrigger />
				<span className="font-semibold text-sm">Home</span>
			</div>
		</div>
	);
}

function getGreeting() {
	const hour = new Date().getHours();
	if (hour < 12) return "Good Morning";
	if (hour < 18) return "Good Afternoon";
	return "Good Evening";
}
