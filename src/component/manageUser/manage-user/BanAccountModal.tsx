// DisableModal.tsx
import React from "react";
import { Modal, Button, Text, Center } from "@mantine/core";

interface User {
	username: string;
	email: string;
	role: string;
	status: string;
}

interface DisableModalProps {
	opened: boolean;
	onClose: () => void;
	onConfirm: () => void;
	userToBan: User | null;
}

const BanAccountModal: React.FC<DisableModalProps> = ({
	opened,
	onClose,
	onConfirm,
	userToBan,
}) => {
	const userStatus = userToBan?.status || "ACTIVE";
	return (
		<Modal
			opened={opened}
			onClose={onClose}
			title={`Confirm ${userStatus === "ACTIVE" ? "Ban" : "Activate"}`}
		>
			<Text>
				Are you sure you want to {userStatus === "ACTIVE" ? "ban" : "activate"}{" "}
				this user?
			</Text>
			<Center mt={"lg"}>
				<Button
					color={userStatus === "ACTIVE" ? "red" : "green"}
					onClick={onConfirm}
				>
					{userStatus === "ACTIVE" ? "Ban" : "Activate"}
				</Button>
				<Button ml="sm" onClick={onClose}>
					Cancel
				</Button>
			</Center>
		</Modal>
	);
};



export default BanAccountModal;
