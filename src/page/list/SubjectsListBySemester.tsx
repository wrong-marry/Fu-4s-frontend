import React, { useEffect, useState } from "react";
import { TextInput, Table, Card } from "@mantine/core";
import {
	IconDots,
	IconSortAscending,
	IconSortDescending,
} from "@tabler/icons-react";
import { loadingIndicator } from "../../App.tsx";
import { BASE_URL } from "../../common/constant.tsx";
export interface Subject {
	code: string;
	name: string;
	semester: number;
	active: boolean;
}
import { useParams, useNavigate } from "react-router-dom";

function SubjectsList() {
	const { semester } = useParams<{ semester: string }>();
	const navigate = useNavigate();
	const [subjects, setSubjects] = useState<Subject[]>([]);
	const [filteredSubjects, setFilteredSubjects] = useState<Subject[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const [search, setSearch] = useState("");
	const [sortBy, setSortBy] = useState<string | null>(null);
	const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

	useEffect(() => {
		async function fetchData() {
			try {
				const token = localStorage.getItem("token");
				const response = await fetch(
					`${BASE_URL}/api/v1/subject/semester/${semester}`,
					{
						headers: {
							Authorization: `Bearer ${token}`,
						},
					}
				);

				if (!response.ok) {
					navigate("/404");
				}

				const data: Subject[] = await response.json();
				setSubjects(data);
				setFilteredSubjects(data);
				setLoading(false);
			} catch (error: any) {
				setError(error.message);
				setLoading(false);
			}
		}

		fetchData();
	}, []);

	useEffect(() => {
		let filtered = subjects;

		if (search) {
			filtered = filtered.filter(
				(subject) =>
					subject.code.toLowerCase().includes(search.toLowerCase()) ||
					subject.name.toLowerCase().includes(search.toLowerCase())
			);
		}

		if (sortBy) {
			filtered = filtered.sort((a, b) => {
				let aField = a[sortBy as keyof Subject];
				let bField = b[sortBy as keyof Subject];

				if (typeof aField === "string") aField = aField.toLowerCase();
				if (typeof bField === "string") bField = bField.toLowerCase();

				if (aField < bField) return sortOrder === "asc" ? -1 : 1;
				if (aField > bField) return sortOrder === "asc" ? 1 : -1;

				return 0;
			});
		}

		setFilteredSubjects(filtered);
	}, [search, subjects, sortBy, sortOrder]);

	if (loading) {
		return loadingIndicator;
	}

	if (error) {
		return <div>Error: {error}</div>;
	}

	const handleInputChange = (
		event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		const { name, value } = event.target;
		const currentSubject = subjects.find((subject) => subject.code === name);
		if (currentSubject) {
			setSubjects((prevSubjects) => {
				const updatedSubjects = prevSubjects.map((subject) =>
					subject.code === name ? { ...subject, [name]: value } : subject
				);
				return updatedSubjects;
			});
		}
	};

	const handleSortClick = (field: string) => {
		setSortBy(field);
		setSortOrder(sortOrder === "asc" ? "desc" : "asc");
	};

	const subjectsList = filteredSubjects.map((subject) => (
		<Table.Tr
			className="text-xs"
			key={subject.code}
			style={{
				textDecoration: "none",
				cursor: "pointer",
				transition: "transform 0.2s ease-in-out",
			}}
			onMouseEnter={(e) => {
				e.currentTarget.style.transform = "scale(1.05)";
			}}
			onMouseLeave={(e) => {
				e.currentTarget.style.transform = "scale(1)";
			}}
			onClick={() => navigate(`/subject/${subject.code}`)}
		>
			<Table.Td className="py-5 px-6 font-medium">{subject.code}</Table.Td>
			<Table.Td className="font-medium">{subject.name}</Table.Td>
			<Table.Td className="font-medium">
				<span
					className={`inline-block py-1 px-2 text-white rounded-full ${
						subject.active ? "bg-green-500" : "bg-red-500"
					}`}
				>
					{subject.active ? "Active" : "Disabled"}
				</span>
			</Table.Td>
		</Table.Tr>
	));

	return (
		<section className="shadow pb-4">
			<div className="container px-4 mx-auto">
				<Card radius="md" shadow="md" withBorder pt="md" mt="lg">
					<div className="container px-4 mx-auto">
						<div className="px-6 border-b">
							<div className="flex flex-wrap items-center mb-6 mt-6">
								<h3 className="text-xl font-bold">SEMESTER {semester}</h3>
								<div className="ml-auto flex items-center">
									<TextInput
										placeholder="Search Subject"
										value={search}
										onChange={(e) => setSearch(e.currentTarget.value)}
										style={{ marginRight: "1rem" }}
									/>
								</div>
							</div>
						</div>

						<Table striped highlightOnHover>
							<Table.Thead>
								<Table.Tr className="text-xs text-gray-500 text-left">
									<Table.Th
										className="pl-6 py-4 font-medium"
										onClick={() => handleSortClick("code")}
										style={{ cursor: "pointer" }}
									>
										<div style={{ display: "flex", alignItems: "center" }}>
											<span>Code</span>
											{sortBy === "code" && (
												<span className="ml-2">
													{sortOrder === "asc" ? (
														<IconSortAscending />
													) : (
														<IconSortDescending />
													)}
												</span>
											)}
										</div>
									</Table.Th>

									<Table.Th
										className="py-4 font-medium"
										onClick={() => handleSortClick("name")}
										style={{ cursor: "pointer" }}
									>
										<div style={{ display: "flex", alignItems: "center" }}>
											<span>Name</span>
											{sortBy === "name" && (
												<span className="ml-2">
													{sortOrder === "asc" ? (
														<IconSortAscending />
													) : (
														<IconSortDescending />
													)}
												</span>
											)}
										</div>
									</Table.Th>

									<Table.Th
										className="py-4 font-medium"
										onClick={() => handleSortClick("status")}
										style={{ cursor: "pointer" }}
									>
										<div style={{ display: "flex", alignItems: "center" }}>
											<span>Status</span>
											{sortBy === "status" && (
												<span className="ml-2">
													{sortOrder === "asc" ? (
														<IconSortAscending />
													) : (
														<IconSortDescending />
													)}
												</span>
											)}
										</div>
									</Table.Th>
								</Table.Tr>
							</Table.Thead>
							<Table.Tbody>{subjectsList}</Table.Tbody>
						</Table>
					</div>
				</Card>
			</div>
		</section>
	);
}

export default SubjectsList;
