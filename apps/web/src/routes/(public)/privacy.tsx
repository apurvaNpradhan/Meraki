import { createFileRoute } from "@tanstack/react-router";
import PublicLayout from "@/components/layout/public-layout";
export const Route = createFileRoute("/(public)/privacy")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<PublicLayout headerContent="Privacy Policy">
			Hello "/(public)/privacy"!
		</PublicLayout>
	);
}
