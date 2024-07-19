// DisableModal.tsx
import React, { useState } from "react";
import { Modal, Button, Center, Box, JsonInput } from "@mantine/core";

interface User {
	username: string;
	email: string;
	role: string;
	status: string;
	enrolledDate: string;
	postCount: number;
}

interface DisableModalProps {
	opened: boolean;
	onClose: () => void;
	onConfirm: (message: string) => void;
	userToSendNoti: User | null;
}

const SendNotiModal: React.FC<DisableModalProps> = ({
	opened,
	onClose: originalOnClose,
	onConfirm,
	userToSendNoti,
}) => {
	const [message, setMessage] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const userName = userToSendNoti?.username;

	const validateInput = () => {
		if (!message.trim()) {
			// Check if message is empty or only contains whitespace
			setErrorMessage("You must enter content to submit"); // Set error message
			return false;
		}
		setErrorMessage(""); // Clear error message if input is valid
		return true;
	};
     const handleClose = () => {
				setErrorMessage(""); // Reset error message
				setMessage(""); // Optionally reset the message as well
				originalOnClose(); // Call the original onClose prop to handle modal close
			};
	const handleSubmit = () => {
		if (validateInput()) {
			onConfirm(message);
			handleClose(); // Optionally close the modal on successful submit
		}
	};
	return (
		<Modal
			opened={opened}
			onClose={handleClose}
			title={`Create a direct notification to ${userName} !!!`}
		>
			{userToSendNoti && (
				<div>
					<p>
						<strong>Username:</strong> {userToSendNoti.username}
					</p>
					<p>
						<strong>Email:</strong> {userToSendNoti.email}
					</p>
					<p>
						<strong>Role:</strong> {userToSendNoti.role}
					</p>
					<p>
						<strong>Status:</strong> {userToSendNoti.status}
					</p>
					<p>
						<strong>Enrolled Date:</strong> {userToSendNoti.enrolledDate}
					</p>
					<p>
						<strong>The number of Uploaded Posts:</strong>{" "}
						{userToSendNoti.postCount}
					</p>
				</div>
			)}
			<JsonInput
				label="Message"
				placeholder="Type your message here"
				value={message}
				onChange={(newValue) => setMessage(newValue)} // Directly use the newValue
				onClick={() => setErrorMessage("")}
				mt="md"
				error={errorMessage}
			/>
			<Center mt={"lg"}>
				<Button color={"green"} onClick={handleSubmit}>
					SUBMIT
				</Button>
				<Button ml="sm" onClick={handleClose}>
					Cancel
				</Button>
			</Center>
			{errorMessage && <Box color="red" mt="sm"></Box>}
		</Modal>
	);
};

export default SendNotiModal;
