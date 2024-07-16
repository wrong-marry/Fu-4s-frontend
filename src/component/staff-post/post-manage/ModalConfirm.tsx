// DisableModal.tsx
import React from "react";
import {Modal, Button, Text, Center} from "@mantine/core";

interface Post {
    subjectCode: string;
    title: string;
    id: string;
    test: string;
    postTime: string;
    status: string;
}

interface DisableModalProps {
    opened: boolean;
    onClose: () => void;
    onConfirm: () => void;
    postToPending: Post | null;
}

const ModalConfirm: React.FC<DisableModalProps> = ({
                                                       opened,
                                                       onClose,
                                                       onConfirm,
                                                       // postToPending,
                                                   }) => {
    // const postStatus = postToPending?.status || "PENDING_APPROVE";
    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title={`Confirm Pending Status`}
        >
            <Text>
                Are you sure to update status for this post?
            </Text>
            <Center mt={"lg"}>
                <Button
                    color="yellow"
                    onClick={onConfirm}
                >
                    UPDATE
                </Button>
                <Button ml="sm" onClick={onClose}>
                    Cancel
                </Button>
            </Center>
        </Modal>
    );
};

export default ModalConfirm;
