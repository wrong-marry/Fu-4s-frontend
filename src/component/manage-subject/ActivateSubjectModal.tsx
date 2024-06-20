// ActivateModal.tsx
import React from "react";
import { Modal, Button, Text, Center } from "@mantine/core";

interface ActivateModalProps {
  opened: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ActivateSubjectModal: React.FC<ActivateModalProps> = ({
  opened,
  onClose,
  onConfirm,
}) => {
  return (
    <Modal opened={opened} onClose={onClose} title="Confirm Activate">
      <Text>Are you sure you want to activate this subject?</Text>
      <Center mt={"lg"}>
        <Button color="green" onClick={onConfirm}>
          Activate
        </Button>
        <Button ml="sm" onClick={onClose}>
          Cancel
        </Button>
      </Center>
    </Modal>
  );
};

export default ActivateSubjectModal;
