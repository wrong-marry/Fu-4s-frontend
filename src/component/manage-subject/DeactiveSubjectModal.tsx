// DeactiveModal.tsx
import React from "react";
import { Modal, Button, Text, Center } from "@mantine/core";

interface DeactiveModalProps {
  opened: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const DeactiveSubjectModal: React.FC<DeactiveModalProps> = ({
  opened,
  onClose,
  onConfirm,
}) => {
  return (
    <Modal opened={opened} onClose={onClose} title="Confirm Deactive">
      <Text>Are you sure you want to deactive this subject?</Text>
      <Center mt={"lg"}>
        <Button color="red" onClick={onConfirm}>
          Deactive
        </Button>
        <Button ml="sm" onClick={onClose}>
          Cancel
        </Button>
      </Center>
    </Modal>
  );
};

export default DeactiveSubjectModal;
