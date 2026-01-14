import type * as React from "react";
import { ForgotPasswordModal } from "@/features/auth/components/forgot-password-modal";
import { ChangeEmailModal } from "@/features/settings/components/change-email-modal";
import { DeleteAccountModal } from "@/features/settings/components/delete-account-modal";
import { UpdatePasswordModal } from "@/features/settings/components/update-password-modal";
import { DeleteWorkspaceModal } from "@/features/workspaces/components/delete-workspace-modal";
import NewWorkspaceModal from "@/features/workspaces/components/new-workspace";
import { type ModalType, useModal } from "@/stores/modal.store";
import Modal from "./ui/modal";

export function ModalProvider() {
	const modal = useModal();
	const ModalRegistry: Record<ModalType, React.ComponentType<any>> = {
		UPDATE_PASSWORD: UpdatePasswordModal,
		DELETE_ACCOUNT: DeleteAccountModal,
		UPDATE_EMAIL: ChangeEmailModal,
		FORGOT_PASSWORD: ForgotPasswordModal,
		NEW_WORKSPACE: NewWorkspaceModal,
		DELETE_WORKSPACE: DeleteWorkspaceModal,
	};
	if (modal.stack.length === 0) return null;

	return (
		<>
			{modal.stack.map((instance) => {
				const Component = ModalRegistry[instance.type];

				if (!Component) {
					console.warn(`No component found for modal type: ${instance.type}`);
					return null;
				}

				return (
					<Modal
						key={instance.id}
						closeOnClickOutside={instance.closeOnClickOutside}
					>
						<Component {...(instance.data || {})} />
					</Modal>
				);
			})}
		</>
	);
}
