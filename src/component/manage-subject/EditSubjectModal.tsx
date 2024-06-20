// EditModal.tsx
import React, { ChangeEvent } from "react";
import { Modal, TextInput, Button, Select } from "@mantine/core";

interface EditModalProps {
  opened: boolean;
  onClose: () => void;
  onSave: () => void;
  subject: {
    code: string;
    name: string;
    semester: string;
  };
  onInputChange: (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
}

const EditSubjectModal: React.FC<EditModalProps> = ({
  opened,
  onClose,
  onSave,
  subject,
  onInputChange,
}) => {
  return (
    <Modal opened={opened} onClose={onClose} title="Edit Subject">
      <TextInput
        label="Code"
        name="code"
        value={subject.code}
        onChange={onInputChange}
        readOnly
        styles={{
          input: {
            backgroundColor: "#f0f0f0",
            color: "#6e6e6e",
            cursor: "not-allowed",
          },
        }}
      />
      <TextInput
        label="Name"
        name="name"
        value={subject.name}
        onChange={onInputChange}
      />
      <Select
        label="Semester"
        name="semester"
        value={subject.semester.toString()}
        onChange={(value) =>
          onInputChange({ target: { name: "semester", value: value ?? "" } })
        }
        data={["1", "2", "3", "4", "5", "6", "7", "8", "9"]}
      />
      <Button mt="10px" onClick={onSave}>
        Save
      </Button>
    </Modal>
  );
};

export default EditSubjectModal;
