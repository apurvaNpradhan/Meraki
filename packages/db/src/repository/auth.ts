import { and, eq } from "drizzle-orm";
import { db } from "..";
import { member } from "../schema";

export const getMember = async (userId: string) => {
	const result = await db.query.member.findFirst({
		where: eq(member.userId, userId),
		with: {
			organization: {
				columns: {
					id: true,
					slug: true,
				},
			},
		},
	});
	return result;
};

export const assertUserInWorkspace = async (
	userId: string,
	workspaceId: string,
	role?: "admin" | "owner" | "member",
) => {
	const result = await db.query.member.findFirst({
		columns: {
			id: true,
		},
		where: and(
			eq(member.userId, userId),
			eq(member.organizationId, workspaceId),
			role ? eq(member.role, role) : undefined,
		),
	});
	return result?.id !== undefined;
};

export const getMemberByOrganizationId = async (
	userId: string,
	organizationId: string,
) => {
	const result = await db.query.member.findFirst({
		where: and(
			eq(member.userId, userId),
			eq(member.organizationId, organizationId),
		),
		with: {
			organization: {
				columns: {
					id: true,
					slug: true,
				},
			},
		},
	});
	return result;
};
