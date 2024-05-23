import React, { useState, useEffect } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

interface QuestionSet {
	title: string;
	attempts: number;
	username: string;
	postTime: string;
}

function QuestionSetList() {
	const [questionSets, setQuestionSets] = useState<QuestionSet[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

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

	if (loading) {
		return <div>Loading...</div>;
	}

	if (error) {
		return <div>Error: {error}</div>;
	}

	return (
		<Paper>
			<TableContainer>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell>Title</TableCell>
							<TableCell>Attempts</TableCell>
							<TableCell>Author</TableCell>
							<TableCell>Posting Time</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{questionSets.map((questionSet, index) => (
							<TableRow key={index}>
								<TableCell>{questionSet.title}</TableCell>
								<TableCell>{questionSet.attempts}</TableCell>
								<TableCell>{questionSet.username}</TableCell>
								<TableCell>{questionSet.postTime}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</Paper>
	);
}

export default QuestionSetList;
