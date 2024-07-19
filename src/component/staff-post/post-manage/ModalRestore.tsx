import React from "react";
import { Modal, Button, Text, Center } from "@mantine/core";

interface DisableModalProps {
	opened: boolean;
	onClose: () => void;
	onConfirm: () => void;
}

const ModalRestore: React.FC<DisableModalProps> = ({
	opened,
	onClose,
	onConfirm,
}) => {
	return (
		<Modal opened={opened} onClose={onClose} title={`Confirm Pending Status`}>
			<Text>Are you sure to update status for this post?</Text>
			<Center mt={"lg"}>
				<Button color="yellow" onClick={onConfirm}>
					UPDATE
				</Button>
				<Button ml="sm" onClick={onClose}>
					Cancel
				</Button>
			</Center>
		</Modal>
	);
};

export default ModalRestore;
