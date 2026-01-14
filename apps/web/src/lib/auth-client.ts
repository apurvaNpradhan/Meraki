import { env } from "@base/env/web";
import type { auth } from "@meraki/auth";
import {
	customSessionClient,
	inferAdditionalFields,
	organizationClient,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
export const authClient = createAuthClient({
	baseURL: env.VITE_SERVER_URL,
	plugins: [
		inferAdditionalFields<typeof auth>(),
		organizationClient(),
		customSessionClient<typeof auth>(),
	],
});

export const sessionQueryOptions = {
	queryKey: ["session"],
	queryFn: () => authClient.getSession(),
	staleTime: 5 * 60 * 1000,
};

export const workspacesQueryOptions = {
	queryKey: ["workspaces"],
	queryFn: () => authClient.organization.list(),
	staleTime: 5 * 60 * 1000,
};
