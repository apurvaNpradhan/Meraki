import { auth } from "@base/auth";
import type { Context as HonoContext } from "hono";

export type CreateContextOptions = {
	context: HonoContext<{ Bindings: { BASE_BUCKET: R2Bucket } }>;
};

export async function createContext({ context }: CreateContextOptions) {
	const session = await auth.api.getSession({
		headers: context.req.raw.headers,
	});
	return {
		session,
		bucket: context.env.BASE_BUCKET,
	};
}

export type Context = Awaited<ReturnType<typeof createContext>>;
