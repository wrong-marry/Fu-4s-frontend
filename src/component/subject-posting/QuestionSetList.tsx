import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {Card, Container, Paper, Table} from "@mantine/core";

interface QuestionSet {
	id: string;
	title: string;
	attempts: number;
	username: string;
	postTime: string;
}

function QuestionSetList() {
	const [questionSets, setQuestionSets] = useState<QuestionSet[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const navigate = useNavigate();

	useEffect(() => {
		async function fetchData() {
			try {
				const response = await fetch(
					"http://localhost:8080/api/v1/questionSet/getAll"
				);

				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}

				const data: QuestionSet[] = await response.json();
				console.log(data);
				setQuestionSets(data);
				setLoading(false);
			} catch (error: any) {
				setError(error.message);
				setLoading(false);
			}
		}
		fetchData();
	}, []);

	const handleRowClick = (link: string) => {
		navigate(link);
	};

	if (loading) {
		return <div>Loading...</div>;
	}

	if (error) {
		return <div>Error: {error}</div>;
	}

const handleQuestionSetClick = (id: string) => {
	navigate(`/post/${id}`);
};

	return (
		<Paper>
			<Container>
				<Card radius={"md"} withBorder>
					<Table p={"xl"}>
						<Table.Thead>
							<Table.Th>Title</Table.Th>
							<Table.Th ta={"center"}>Attempts</Table.Th>
							<Table.Th ta={"center"}>Author</Table.Th>
							<Table.Th ta={"center"}>Posting Time</Table.Th>
						</Table.Thead>
						<Table.Tbody>
							{questionSets.map((questionSet) => (
								<Table.Tr key={questionSet.id}>
									<Table.Td
									onClick={() => handleQuestionSetClick(questionSet.id)}
									style={{
										cursor: "pointer",
									}}
								>
									{questionSet.title}
									</Table.Td>
									<Table.Td ta={"center"}>{questionSet.attempts}</Table.Td>
									<Table.Td ta={"center"}>{questionSet.username}</Table.Td>
									<Table.Td ta={"center"}>{questionSet.postTime}</Table.Td>
								</Table.Tr>
						))}
						</Table.Tbody>
				</Table>
				</Card>
			</Container>
		</Paper>
	);
}

export default QuestionSetList;
