import { Link } from "@tanstack/react-router";

import { authClient } from "@/lib/auth-client";

import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";

export default function UserMenu() {
	const { data: session, isPending } = authClient.useSession();
	const url =
		session?.session.activeOrganization?.slug ?? "/onboarding/workspace";

	if (isPending) {
		return <Skeleton className="h-9 w-24" />;
	}

	if (!session) {
		return (
			<Link to="/sign-up">
				<Button variant="outline">Sign up</Button>
			</Link>
		);
	}

	return (
		<Button
			render={
				<Link
					to={url}
					params={{ slug: session?.session.activeOrganization?.slug ?? "" }}
				/>
			}
		>
			Go to app
		</Button>
	);
}
