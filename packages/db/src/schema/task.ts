import { sql } from "drizzle-orm";
import {
	type AnyPgColumn,
	bigint,
	boolean,
	index,
	integer,
	jsonb,
	pgTable,
	timestamp,
	uuid,
	varchar,
} from "drizzle-orm/pg-core";
import type { SerializedEditorState } from "../lib/type";
import { organization, user } from "../schema/auth";
import { timestamps } from "../utils/timestamps";
import { projects } from "./project";
import { statuses } from "./status";

export const tasks = pgTable(
	"task",
	{
		id: bigint("id", { mode: "bigint" })
			.primaryKey()
			.generatedAlwaysAsIdentity(),

		publicId: uuid("public_id")
			.notNull()
			.unique()
			.default(sql`uuid_generate_v7()`),
		title: varchar("title", { length: 500 }).notNull(),
		description: jsonb("description").$type<SerializedEditorState>(),
		projectId: bigint("project_id", { mode: "bigint" }).references(
			() => projects.id,
		),
		statusId: bigint("status_id", { mode: "bigint" }).references(
			() => statuses.id,
			{ onDelete: "set null" },
		),
		priority: integer("priority").default(0).notNull(),
		position: varchar("position", { length: 32 }).notNull(),
		isArchived: boolean("is_archived").default(false).notNull(),
		parentTaskId: bigint("parent_task_id", { mode: "bigint" }).references(
			(): AnyPgColumn => tasks.id,
			{ onDelete: "cascade" },
		),

		assigneeId: uuid("assignee_id").references(() => user.id, {
			onDelete: "set null",
		}),

		deadline: timestamp("deadline", {
			mode: "date",
			precision: 3,
			withTimezone: true,
		}),
		completedAt: timestamp("completed_at", {
			mode: "date",
			precision: 3,
			withTimezone: true,
		}),

		createdBy: uuid("created_by")
			.notNull()
			.references(() => user.id),

		organizationId: uuid("organization_id")
			.notNull()
			.references(() => organization.id, { onDelete: "cascade" }),

		deletedBy: uuid("deleted_by").references(() => user.id, {
			onDelete: "set null",
		}),

		...timestamps,
	},
	(table) => [
		index("task_parentTaskId_idx").on(table.parentTaskId),
		index("task_assigneeId_idx").on(table.assigneeId),
		index("task_status_idx").on(table.statusId),
		index("task_organizationId_idx").on(table.organizationId),
	],
).enableRLS();
