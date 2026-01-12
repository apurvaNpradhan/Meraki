import { cn } from "@/lib/utils";
import { useModal } from "@/stores/modal.store";
import { ResponsiveModal, ResponsiveModalContent } from "./responsive-modal";

interface Props {
	children: React.ReactNode;
	modalSize?: "sm" | "md" | "lg" | "fullscreen";
	onClose?: () => void;
	positionFromTop?: "sm" | "md" | "lg" | "none";
	isVisible?: boolean;
	closeOnClickOutside?: boolean;
}

const Modal: React.FC<Props> = ({
	children,
	onClose,
	closeOnClickOutside,
	isVisible,
	modalSize = "md",
	positionFromTop = "none",
}) => {
	const { isOpen, close } = useModal();

	const shouldShow = isVisible ?? isOpen;
	const shouldCloseOnClickOutside = true;
	const modalSizeMap = {
		sm: "sm:max-w-[400px]",
		md: "sm:max-w-[550px]",
		lg: "sm:max-w-[800px]",
		fullscreen: "sm:max-w-[calc(100vw-80px)] sm:max-h-[calc(100vh-80px)]",
	};

	const positionFromTopClasses = {
		none: "", // Default centering from DialogContent
		sm: "top-[10%] translate-y-0",
		md: "top-[20%] translate-y-0",
		lg: "top-[30%] translate-y-0",
	};

	const handleOpenChange = (open: boolean) => {
		if (!open) {
			close();
			onClose?.();
		}
	};

	return (
		<ResponsiveModal
			open={shouldShow}
			onOpenChange={shouldCloseOnClickOutside ? handleOpenChange : undefined}
		>
			<ResponsiveModalContent
				className={cn(
					modalSizeMap[modalSize],
					positionFromTopClasses[positionFromTop],
					"duration-200",
				)}
			>
				{children}
			</ResponsiveModalContent>
		</ResponsiveModal>
	);
};

export default Modal;
