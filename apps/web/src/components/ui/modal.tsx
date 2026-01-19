import React from "react";
import { cn } from "@/lib/utils";
import { useModal } from "@/stores/modal.store";
import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "./alert-dialog";
import { Button } from "./button";
import { ResponsiveModal, ResponsiveModalContent } from "./responsive-modal";

interface Props {
	children: React.ReactNode;
	modalSize?: "sm" | "md" | "lg" | "fullscreen";
	confirmation?: boolean;
	isDirty?: boolean;
	onClose?: () => void;
	positionFromTop?: "sm" | "md" | "lg" | "none";
	isVisible?: boolean;
	closeOnClickOutside?: boolean;
}

const Modal: React.FC<Props> = ({
	children,
	onClose,
	closeOnClickOutside,
	confirmation,
	isDirty,
	isVisible,
	modalSize = "md",
	positionFromTop = "none",
}) => {
	const { isOpen, close } = useModal();
	const [confirmationOpen, setConfirmationOpen] = React.useState(false);
	const shouldShow = isVisible ?? isOpen;
	const shouldCloseOnClickOutside = closeOnClickOutside ?? true;
	const modalSizeMap = {
		sm: "lg:w-full lg:max-w-[400px]",
		md: "lg:w-full lg:max-w-[550px]",

		lg: "lg:w-full lg:max-w-[796px]",
		fullscreen:
			"lg:w-full lg:max-w-[calc(100vw-80px)] lg:max-h-[calc(100vh-80px)]",
	};

	const positionFromTopClasses = {
		none: "", // Default centering from DialogContent
		sm: "lg:top-[10%] lg:translate-y-0",
		md: "lg:top-[20%] lg:translate-y-0",
		lg: "lg:top-[30%] lg:translate-y-0",
	};

	const handleOpenChange = (open: boolean) => {
		if (!open) {
			if (confirmation || isDirty) {
				setConfirmationOpen(true);
			} else {
				handleClose();
			}
		}
	};

	const handleClose = () => {
		onClose?.();
		close();
		setConfirmationOpen(false);
	};

	return (
		<>
			<ResponsiveModal
				open={shouldShow}
				onOpenChange={shouldCloseOnClickOutside ? handleOpenChange : undefined}
			>
				<ResponsiveModalContent
					className={cn(
						modalSizeMap[modalSize],
						positionFromTopClasses[positionFromTop],
						"bg-card duration-200",
					)}
				>
					{children}
				</ResponsiveModalContent>
			</ResponsiveModal>
			<AlertDialog open={confirmationOpen} onOpenChange={setConfirmationOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Discard this item?</AlertDialogTitle>
						<AlertDialogDescription>
							Confirm to discard this item.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<Button
							variant={"ghost"}
							onClick={() => setConfirmationOpen(false)}
						>
							Cancel
						</Button>
						<Button variant="destructive" onClick={handleClose}>
							Discard
						</Button>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
};

export default Modal;
