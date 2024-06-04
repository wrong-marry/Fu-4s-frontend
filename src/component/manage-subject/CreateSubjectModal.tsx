// CreateModal.tsx
import React from "react";
import { Modal, TextInput, Button } from "@mantine/core";

interface CreateModalProps {
  opened: boolean;
  onClose: () => void;
  onSave: () => void;
  subject: {
    code: string;
    name: string;
    semester: number;
  };
  onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const CreateSubjectModal: React.FC<CreateModalProps> = ({
  opened,
  onClose,
  onSave,
  subject,
  onInputChange,
}) => {
  return (
    <Modal opened={opened} onClose={onClose} title="Create New Subject">
      <TextInput
        label="Code"
        name="code"
        value={subject.code}
        onChange={onInputChange}
      />
      <TextInput
        label="Name"
        name="name"
        value={subject.name}
        onChange={onInputChange}
      />
      <TextInput
        label="Semester"
        name="semester"
        value={subject.semester.toString()}
        onChange={onInputChange}
      />
      <Button onClick={onSave}>Create</Button>
    </Modal>
  );
};

export default CreateSubjectModal;
