import { eq } from "drizzle-orm";
import { db } from "..";
import { member } from "../schema";

export const getMember = async (userId: string) => {
	const result = await db.query.member.findFirst({
		where: eq(member.userId, userId),
		with: {
			organization: {
        columns: {
          id: true,
        },
      },
		},
	});
	return result;
};
