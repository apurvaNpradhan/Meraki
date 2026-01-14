import { createFileRoute } from "@tanstack/react-router";
import OnboardingWorkspaceForm from "@/features/onboarding/components/new-workspace";

export const Route = createFileRoute("/(authenicated)/onboarding/workspace")({
	component: RouteComponent,
});

function RouteComponent() {
	return <OnboardingWorkspaceForm />;
}
