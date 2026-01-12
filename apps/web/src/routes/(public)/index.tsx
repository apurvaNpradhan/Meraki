import { createFileRoute } from "@tanstack/react-router";
import PublicLayout from "@/components/layout/public-layout";
import { ModeToggle } from "@/components/mode-toggle";
import UserMenu from "@/components/user-menu";

export const Route = createFileRoute("/(public)/")({
	component: HomeComponent,
});

function HomeComponent() {
	return (
		<PublicLayout headerContent={<Header />}>
			<div className="flex flex-col gap-2">
				<h1 className="font-bold text-6xl">Base</h1>

				<p className="text-lg">
					A fullstack template for building web applications.
				</p>
			</div>
		</PublicLayout>
	);
}

function Header() {
	return (
		<div className="flex w-full items-center justify-between">
			<span className="font-bold">Base</span>
			<div className="flex gap-2">
				<ModeToggle />
				<UserMenu />
			</div>
		</div>
	);
}
