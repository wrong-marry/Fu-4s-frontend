// DisableModal.tsx
import React from "react";
import { Modal, Button, Text, Center } from "@mantine/core";

interface DisableModalProps {
  opened: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const DisableSubjectModal: React.FC<DisableModalProps> = ({
  opened,
  onClose,
  onConfirm,
}) => {
  return (
    <Modal opened={opened} onClose={onClose} title="Confirm Disable">
      <Text>Are you sure you want to disable this subject?</Text>
      <Center mt={"lg"}>
        <Button color="red" onClick={onConfirm}>
          Disable
        </Button>
        <Button ml="sm" onClick={onClose}>
          Cancel
        </Button>
      </Center>
    </Modal>
  );
};

export default DisableSubjectModal;
