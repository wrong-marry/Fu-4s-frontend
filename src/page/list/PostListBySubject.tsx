import React, { useState, useEffect } from "react";
import { Center, Title, Anchor } from "@mantine/core";
import PostTypeTab from "../../component/subject-posting/PostTypeTab";
import { useParams, useNavigate } from "react-router-dom";
import { IconChevronsRight } from "@tabler/icons-react";
export interface Subject {
	code: string;
	name: string;
	semester: number;
	active: boolean;
}

const PostsListBySubject: React.FC = () => {
	const { code } = useParams<{ code: string }>();
	const [subject, setSubject] = useState<Subject | null>(null);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchSubject = async () => {
			try {
				const response = await fetch(
					`http://localhost:8080/api/v1/subject/${code}`
				);
				if (!response.ok) {
					// Nếu phản hồi không OK, điều hướng tới trang 404
					navigate("/404");
					return;
				}
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
			<Center style={{ display: "flex", gap: "10px" }}>
				<Anchor href="/">FU4S</Anchor> <IconChevronsRight size={20} />
				<Anchor href={`/semester/${subject?.semester ?? ""}`}>
					Semester {subject?.semester}
				</Anchor>
			</Center>
			<Title order={1} m="20">
				{(subject?.code ?? "") + " " + (subject?.name ?? "")}
			</Title>
			<div>{code && <PostTypeTab subject={code} key={code} />}</div>
		</Center>
	);
};

export default PostsListBySubject;
