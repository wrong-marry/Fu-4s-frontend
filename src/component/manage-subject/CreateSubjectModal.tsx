import React from "react";
import { Modal, TextInput, Button, Select } from "@mantine/core";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

interface CreateModalProps {
	opened: boolean;
	onClose: () => void;
	onSave: (values: any) => void;
	subject: {
		code: string;
		name: string;
		semester: number;
	};
	onInputChange: (
		event:
			| React.ChangeEvent<HTMLInputElement>
			| { target: { name: string; value: string } }
	) => void;
}
const validationSchema = Yup.object().shape({
	code: Yup.string()
		.required("Code is required")
		.min(3, "Code must be at least 3 characters"),
	name: Yup.string()
		.required("Name is required")
		.min(2, "Name must be at least 2 characters"),
	semester: Yup.number()
		.required("Semester is required")
		.min(1, "Semester must be at least 1")
		.max(9, "Semester must be no more than 9"),
});

const CreateSubjectModal: React.FC<CreateModalProps> = ({
	opened,
	onClose,
	onSave,
	subject,
	onInputChange,
}) => {
	const handleSubmit = (values: any, props: any) => {
		onSave(values);
		props.resetForm();
	};

	return (
		<Modal opened={opened} onClose={onClose} title="Create New Subject">
			<Formik
				initialValues={subject}
				onSubmit={handleSubmit}
				validationSchema={validationSchema}
				enableReinitialize
			>
				{({ handleSubmit }) => (
					<form onSubmit={handleSubmit}>
						<div>
							<label htmlFor="code">Code</label>
							<Field
								as={TextInput}
								id="code"
								name="code"
								value={subject.code}
								onChange={onInputChange}
							/>
							<div style={{ color: "red", fontSize: "12px" }}>
								<ErrorMessage name="code" component="div" />
							</div>
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
							<div style={{ color: "red", fontSize: "12px" }}>
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
									onInputChange({
										target: { name: "semester", value: value ?? "" },
									})
								}
								data={["1", "2", "3", "4", "5", "6", "7", "8", "9"]}
							/>
							<ErrorMessage name="semester" component="div" />
						</div>
						<Button type="submit" mt="10px">
							Create
						</Button>
					</form>
				)}
			</Formik>
		</Modal>
	);
};

export default CreateSubjectModal;
