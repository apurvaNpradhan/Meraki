import {
	InsertStatus,
	type SelectStatus,
	UpdateStatus,
} from "@meraki/db/lib/zod-schemas";
import type { statusType } from "@meraki/db/schema/status";
import { z } from "zod";

export const InsertStatusInput = InsertStatus.pick({
	name: true,
	colorCode: true,
	type: true,
}).extend({
	projectPublicId: z.string(),
});

export const UpdateStatusInput = UpdateStatus.pick({
	name: true,
	colorCode: true,
	type: true,
	position: true,
}).extend({
	publicId: z.string(),
});

export type InsertStatusInput = z.infer<typeof InsertStatusInput>;
export type UpdateStatusInput = z.infer<typeof UpdateStatusInput>;
export type StatusType = statusType;
export type Status = z.infer<typeof SelectStatus>;
