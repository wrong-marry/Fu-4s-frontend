// DeleteModal.tsx
import React from "react";
import {Button, Center, Modal, Text} from "@mantine/core";

interface DeleteModalProps {
    opened: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

const DeleteModal: React.FC<DeleteModalProps> = ({
                                                     opened,
                                                     onClose,
                                                     onConfirm,
                                                 }) => {
    return (
        <Modal opened={opened} onClose={onClose} title="Confirm Delete">
            <Text>Are you sure you want to delete this subject?</Text>
            <Center mt={"lg"}>
                <Button color="red" onClick={onConfirm}>
                    Delete
                </Button>
                <Button ml="sm" onClick={onClose}>
                    Cancel
                </Button>
            </Center>
        </Modal>
    );
};

export default DeleteModal;
