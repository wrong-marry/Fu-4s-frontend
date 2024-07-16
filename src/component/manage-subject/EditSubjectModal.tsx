import React, { ChangeEvent } from "react";
import { Modal, TextInput, Button, Select } from "@mantine/core";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

interface EditModalProps {
  opened: boolean;
  onClose: () => void;
  onSave: (values: any) => void;
  subject: {
    code: string;
    name: string;
    semester: string;
  };
  onInputChange: (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
}

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .required('Name is required')
    .min(2, 'Name must be at least 2 characters'),
});

const EditSubjectModal: React.FC<EditModalProps> = ({
  opened,
  onClose,
  onSave,
  subject,
  onInputChange,
}) => {
  const handleSubmit = (values: any) => {
    onSave(values);
  };

  return (
    <Modal opened={opened} onClose={onClose} title="Edit Subject">
      <Formik
        initialValues={subject}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {() => (
          <Form>
            <div>
              <label htmlFor="code">Code</label>
              <Field
                as={TextInput}
                id="code"
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
            </div>
            <div>
              <label htmlFor="name">Name</label>
              <Field
                as={TextInput}
                id="name"
                name="name"
                value={subject.name}
                onChange={onInputChange}
              />
              <div style={{ color: 'red', fontSize: '12px' }}>
                <ErrorMessage name="name" component="div" />
              </div>
            </div>
            <div>
              <label htmlFor="semester">Semester</label>
              <Field
                as={Select}
                id="semester"
                name="semester"
                value={subject.semester.toString()}
                onChange={(value: string) =>
                  onInputChange({ target: { name: "semester", value: value ?? "" } })
                }
                data={["1", "2", "3", "4", "5", "6", "7", "8", "9"]}
              />
            </div>
            <Button type="submit" mt="10px">
              Save
            </Button>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default EditSubjectModal;
