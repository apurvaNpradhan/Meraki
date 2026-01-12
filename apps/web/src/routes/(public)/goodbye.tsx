import { IconHeartBroken } from "@tabler/icons-react";
import { createFileRoute, Link } from "@tanstack/react-router";
import PublicLayout from "@/components/layout/public-layout";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/(public)/goodbye")({
	component: GoodbyePage,
});

function GoodbyePage() {
	return (
		<PublicLayout
			headerContent={
				<Link
					to="/"
					className="flex items-center gap-2 font-bold text-xl tracking-tight"
				>
					<span>base</span>
				</Link>
			}
		>
			<div className="flex flex-col items-center justify-center gap-8 py-12 text-center">
				<IconHeartBroken
					size={60}
					className="fill-destructive text-background"
				/>
				<div className="flex flex-col gap-3">
					<h1 className="font-bold text-4xl tracking-tight">
						We're sorry to see you go.
					</h1>
					<p className="mx-auto max-w-md text-lg text-muted-foreground">
						Your account has been successfully deleted. All of your data has
						been permanently removed from our servers.
					</p>
				</div>

				<div className="mt-4 flex flex-col gap-4">
					<p className="text-muted-foreground text-sm">
						Changed your mind? We'd love to have you back anytime.
					</p>
					<Button size="lg" className="px-8">
						<Link to="/sign-up">Create a New Account</Link>
					</Button>
				</div>

				<div className="mt-12 border-border/50 border-t pt-8">
					<p className="text-muted-foreground text-sm">
						Thank you for being a part of our journey.
					</p>
				</div>
			</div>
		</PublicLayout>
	);
}
