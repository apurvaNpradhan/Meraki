import {
	Body,
	Button,
	Container,
	Head,
	Hr,
	Html,
	Section,
	Tailwind,
	Text,
} from "@react-email/components";

interface DeleteAccountEmailProps {
	username: string;
	deleteUrl: string;
}

const DeleteAccountEmail = (props: DeleteAccountEmailProps) => {
	const { username, deleteUrl } = props;
	return (
		<Html dir="ltr" lang="en">
			<Tailwind>
				<Head />
				<Body className="bg-gray-100 py-[40px] font-sans">
					<Container className="mx-auto max-w-[600px] rounded-[8px] bg-white p-[32px]">
						<Section>
							<Text className="mt-0 mb-[16px] font-bold text-[24px] text-gray-900">
								Delete your account
							</Text>

							<Text className="mt-0 mb-[24px] text-[16px] text-gray-700 leading-[24px]">
								Hi {username},
							</Text>

							<Text className="mt-0 mb-[24px] text-[16px] text-gray-700 leading-[24px]">
								We received a request to permanently delete your account. If
								you're sure you want to do this, please click the button below
								to confirm.
							</Text>

							<Section className="mb-[32px] text-center">
								<Button
									className="box-border rounded-[6px] bg-red-600 px-[32px] py-[12px] font-medium text-[16px] text-white no-underline"
									href={deleteUrl}
								>
									Delete Account
								</Button>
							</Section>

							<Text className="mt-0 mb-[24px] text-[14px] text-gray-600 leading-[20px]">
								Warning: This action is permanent and cannot be undone. All your
								data will be permanently removed.
							</Text>

							<Text className="mt-0 mb-[24px] text-[14px] text-gray-600 leading-[20px]">
								If the button doesn&apos;t work, you can copy and paste this
								link into your browser:
								<br />
								{deleteUrl}
							</Text>

							<Text className="mt-0 mb-[32px] text-[14px] text-gray-600 leading-[20px]">
								If you didn&apos;t request this, you can safely ignore this
								email. Your account will remain active.
							</Text>

							<Hr className="my-[24px] border-gray-200" />

							<Text className="m-0 text-[12px] text-gray-500 leading-[16px]">
								Best regards,
								<br />
								The Team
							</Text>
						</Section>

						<Section className="mt-[32px] border-gray-200 border-t pt-[24px]">
							<Text className="m-0 mt-[8px] text-center text-[12px] text-gray-400 leading-[16px]">
								© 2024 base. All rights reserved.
							</Text>
						</Section>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	);
};

export default DeleteAccountEmail;
