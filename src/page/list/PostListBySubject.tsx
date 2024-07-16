import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Center, Title } from "@mantine/core";
import PostTypeTab from "../../component/subject-posting/PostTypeTab";

export interface Subject {
	code: string;
	name: string;
	semester: number;
	active: boolean;
}

const PostsListBySubject: React.FC = () => {
	const { code } = useParams<{ code: string }>();
	const [subject, setSubject] = useState<Subject | null>(null);

	useEffect(() => {
		const fetchSubject = async () => {
			try {
				const response = await fetch(
					`http://localhost:8080/api/v1/subject/${code}`
				);
				const data: Subject = await response.json();
				setSubject(data);
				document.title = `${data.code} - ${data.name}`;
			} catch (error) {
				console.error("Error fetching subject:", error);
			}
		};

		if (code) {
			fetchSubject();
		}
	}, [code]);

	useEffect(() => {
		if (subject) {
			document.title = `${subject.code} - ${subject.name}`;
		}
	}, [subject]);

	return (
		<Center style={{ flexDirection: "column" }}>
			<Title order={1} m="20">
				{(subject?.code ?? "") + " " + (subject?.name ?? "")}
			</Title>
			<div>{code && <PostTypeTab subject={code} key={code} />}</div>
		</Center>
	);
};

export default PostsListBySubject;
