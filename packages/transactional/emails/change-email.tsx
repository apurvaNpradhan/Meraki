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

interface ChangeEmailProps {
	username: string;
	newEmail: string;
	changeEmailUrl: string;
}

const ChangeEmail = (props: ChangeEmailProps) => {
	const { username, newEmail, changeEmailUrl } = props;
	return (
		<Html dir="ltr" lang="en">
			<Tailwind>
				<Head />
				<Body className="bg-gray-100 py-[40px] font-sans">
					<Container className="mx-auto max-w-[600px] rounded-[8px] bg-white p-[32px]">
						<Section>
							<Text className="mt-0 mb-[16px] font-bold text-[24px] text-gray-900">
								Confirm your email change
							</Text>

							<Text className="mt-0 mb-[24px] text-[16px] text-gray-700 leading-[24px]">
								Hi {username}, we received a request to change your email
								address to <strong>{newEmail}</strong>. To approve this change,
								please click the button below.
							</Text>

							<Section className="mb-[32px] text-center">
								<Button
									className="box-border rounded-[6px] bg-blue-600 px-[32px] py-[12px] font-medium text-[16px] text-white no-underline"
									href={changeEmailUrl}
								>
									Approve Email Change
								</Button>
							</Section>

							<Text className="mt-0 mb-[24px] text-[14px] text-gray-600 leading-[20px]">
								If the button doesn&apos;t work, you can copy and paste this
								link into your browser:
								<br />
								{changeEmailUrl}
							</Text>

							<Text className="mt-0 mb-[32px] text-[14px] text-gray-600 leading-[20px]">
								This link will expire in 24 hours. If you didn&apos;t request
								this change, you can safely ignore this email and your email
								address will remain unchanged.
							</Text>

							<Hr className="my-[24px] border-gray-200" />

							<Text className="m-0 text-[12px] text-gray-500 leading-[16px]">
								Best regards,
								<br />
								The Team
							</Text>
						</Section>

						<Section className="mt-[32px] border-gray-200 border-t pt-[24px]">
							<Text className="m-0 text-center text-[12px] text-gray-400 leading-[16px]">
								Company Name
								<br />
								123 Business Street, Suite 100
								<br />
								City, State 12345
							</Text>

							<Text className="m-0 mt-[8px] text-center text-[12px] text-gray-400 leading-[16px]">
								© 2024 Company Name. All rights reserved.
							</Text>
						</Section>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	);
};

export default ChangeEmail;
