import * as React from "react";
import {Box, Button, ButtonGroup, Group, NativeSelect, Text} from "@mantine/core";
import {Subject} from '../manage-subject/TableSubject';
import {useEffect} from "react";

export default function StudyComponentOne() {
	const [selectedButton, setSelectedButton] = React.useState<Subject>();
	const [semester, setSemester] = React.useState<string>('1');
	const [subjects, setSubjects] = React.useState<Subject[]>([]);


	useEffect(() => {
		async function fetchData() {
			try {
				const token = localStorage.getItem("token");
				const response = await fetch(
					`http://localhost:8080/api/v1/subject/getAll`,
					{
						headers: {
							Authorization: `Bearer ${token}`,
						},
					}
				);

				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}

				const data: Subject[] = await response.json();
				setSubjects(data);
			} catch (error) {
				console.log(error);
			}
		}

		fetchData();
	}, []);

	const [semesterSubjects, setSemesterSubjects] = React.useState<Subject[]>(subjects.filter(subject => subject.semester == 1));
	useEffect(() => {
		setSemesterSubjects(subjects.filter(subject => subject.semester + "" == semester));
	}, [semester]);

	const buttons = semesterSubjects.map(sub => <Button
		key={sub.code}
		variant={selectedButton?.code == sub?.code ? "outline" : "filled"}
		onClick={() => setSelectedButton(sub)}
	>
		{sub.code}
	</Button>);

	return (
		<Box mt={"md"}
			 style={{
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				"& > *": {
					m: 1,
				},
			}}
		>
			<Group>
				<Text fw={600}>Semester</Text>
				<NativeSelect
					ta={"center"}
					display={"inline"}
					value={semester}
					onChange={(event) => setSemester(event.currentTarget.value)}
					data={['1', '2', '3', '4', '5', '6', '7', '8', '9']}
				/>
			</Group>
			<ButtonGroup my={"md"} c="secondary" aria-label="Medium-sized button group">
				{buttons}
			</ButtonGroup>
			<h1>
				{(selectedButton?.code ?? "") + " " + (selectedButton?.name ?? "")}
			</h1>
		</Box>
	);
}
