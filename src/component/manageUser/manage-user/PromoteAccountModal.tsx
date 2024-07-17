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
	userToPromote: User | null;
}

const PromoteAccountModal: React.FC<DisableModalProps> = ({
	opened,
	onClose,
	onConfirm,
	userToPromote,
}) => {
	const userRole = userToPromote?.role || "USER";
	return (
		<Modal
			opened={opened}
			onClose={onClose}
			title={`Confirm ${userRole === "USER" ? "Promote" : "Demote"}`}
		>
			<Text>
				Are you sure you want to {userRole === "USER" ? "Promote " : "Demote "}
				 this user from {userRole === "USER" ? "USER" : "STAFF"} to{" "}
				{userRole === "USER" ? "STAFF" : "USER"} ?
			</Text>
			<Center mt={"lg"}>
				<Button
					color={userRole === "ACTIVE" ? "red" : "green"}
					onClick={onConfirm}
				>
					{userRole === "USER" ? "Promote" : "Demote"}
				</Button>
				<Button ml="sm" onClick={onClose}>
					Cancel
				</Button>
			</Center>
		</Modal>
	);
};

export default PromoteAccountModal;
