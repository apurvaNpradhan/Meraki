import { relations } from "drizzle-orm";
import {
	account,
	invitation,
	member,
	organization,
	session,
	user,
} from "./auth";
import { tasks } from "./task";

export const userRelations = relations(user, ({ many }) => ({
	sessions: many(session),
	accounts: many(account),
	createdTasks: many(tasks, {
		relationName: "task_creator",
	}),
	deletedTasks: many(tasks, {
		relationName: "task_deleter",
	}),
	assignedTasks: many(tasks, {
		relationName: "task_assignee",
	}),
}));

export const sessionRelations = relations(session, ({ one }) => ({
	user: one(user, {
		fields: [session.userId],
		references: [user.id],
	}),
	activeOrganization: one(organization, {
		fields: [session.activeOrganizationId],
		references: [organization.id],
	}),
}));

export const accountRelations = relations(account, ({ one }) => ({
	user: one(user, {
		fields: [account.userId],
		references: [user.id],
	}),
}));

export const organizationRelations = relations(organization, ({ many }) => ({
	members: many(member),
	invitations: many(invitation),
	tasks: many(tasks),
}));

export const memberRelations = relations(member, ({ one }) => ({
	organization: one(organization, {
		fields: [member.organizationId],
		references: [organization.id],
	}),
	user: one(user, {
		fields: [member.userId],
		references: [user.id],
	}),
}));

export const invitationRelations = relations(invitation, ({ one }) => ({
	organization: one(organization, {
		fields: [invitation.organizationId],
		references: [organization.id],
	}),
	inviter: one(user, {
		fields: [invitation.inviterId],
		references: [user.id],
	}),
}));

export const taskRelations = relations(tasks, ({ many, one }) => ({
	parent: one(tasks, {
		fields: [tasks.parentTaskId],
		references: [tasks.id],
		relationName: "task_parent",
	}),
	subtasks: many(tasks, {
		relationName: "task_parent",
	}),
	assignee: one(user, {
		fields: [tasks.assigneeId],
		references: [user.id],
	}),
	createdBy: one(user, {
		fields: [tasks.createdBy],
		references: [user.id],
	}),
	deletedBy: one(user, {
		fields: [tasks.deletedBy],
		references: [user.id],
	}),
	organization: one(organization, {
		fields: [tasks.organizationId],
		references: [organization.id],
	}),
}));
