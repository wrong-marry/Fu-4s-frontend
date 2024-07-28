import { useEffect, useState } from "react";
import {
	Card,
	Center,
	Grid,
	Pagination,
	Table,
	Text,
	Paper,
	Select,
	TextInput,
	Avatar as MantineAvatar,
	Stack,
} from "@mantine/core";
import { useParams, useNavigate } from "react-router-dom";
import { BASE_URL } from "../../common/constant";
import { fetchUserByUsername } from "../../util/UserFetchUtil";
import { format } from "date-fns";
import {
	IconUserCheck,
	IconLock,
	IconUser,
	IconShield,
	IconBriefcase,
	IconFile,
	IconCalendarUser,
} from "@tabler/icons-react";
import React from "react";

interface User {
	username: string;
	email: string;
	firstName: string;
	lastName: string;
	role: string;
	status: string;
	enrolledDate: string;
}

interface Post {
	id: string;
	title: string;
	status: string;
	subjectCode: string;
	postTime: string;
}

export function PostsListByUser() {
	const { username = "" } = useParams<{ username: string }>();
	const navigate = useNavigate();
	const pageSize = 5;
	const [avatarUrl, setAvatarUrl] = React.useState<string | null>(
		"https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-11.png"
	);
	useEffect(() => {
		if (username) {
			const url = `${BASE_URL}/api/v1/user/getAvatar?username=${username}`;
			setAvatarUrl(url);
		}
	}, [username]);

	const [activePage, setPage] = useState<number>(1);
	const [numPage, setNumPage] = useState<number>(1);
	const [posts, setPosts] = useState<Post[]>([]);
	const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
	const [user, setUser] = useState<User | null>(null);
	const [subjectCodes, setSubjectCodes] = useState<string[]>([]);
	const [subjectFilter, setSubjectFilter] = useState<string>("All");
	const [search, setSearch] = useState("");
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const response = await fetchUserByUsername(username);
				const data: User = response.data;
				setUser(data);
			} catch (error) {
				console.error("Error fetching user:", error);
			}
		};

		const fetchPosts = async () => {
			setLoading(true);
			try {
				const token = localStorage.getItem("token");
				const url = `${BASE_URL}/api/v1/post/getAllActivePostsByUsername?username=${username}&pageNum=${activePage}&pageSize=${pageSize}`;
				const response = await fetch(url, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});

				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}

				const data: Post[] = await response.json();
				setPosts(data);
				setFilteredPosts(data);
				setNumPage(Math.ceil(data.length / pageSize));
				setLoading(false);
			} catch (error: any) {
				setError(error.message);
			}
		};

		const fetchSubjectCodes = async () => {
			try {
				const token = localStorage.getItem("token");
				const response = await fetch(
					`${BASE_URL}/api/v1/subject/getAllSubjectCodes`,
					{
						method: "GET",
						headers: {
							Authorization: `Bearer ${token}`,
							"Content-Type": "application/json",
						},
					}
				);
				if (response.ok) {
					const data = await response.json();
					setSubjectCodes(data);
				} else {
					console.error("Failed to fetch subject codes");
				}
			} catch (error) {
				console.error("Error fetching subject codes:", error);
			}
		};

		fetchUser();
		fetchPosts();
		fetchSubjectCodes();
	}, [username, navigate]);

	useEffect(() => {
		const filterPosts = () => {
			let filtered = posts;

			if (subjectFilter && subjectFilter !== "All") {
				filtered = filtered.filter(
					(post) => post.subjectCode === subjectFilter
				);
			}

			if (search) {
				filtered = filtered.filter((post) =>
					post.title.toLowerCase().includes(search.toLowerCase())
				);
			}

			setFilteredPosts(filtered);
			setNumPage(Math.ceil(filtered.length / pageSize));
			setPage(1);
		};

		filterPosts();
	}, [search, subjectFilter, posts]);

	const rows = filteredPosts
		.slice((activePage - 1) * pageSize, activePage * pageSize)
		.map((post, index) => (
			<Table.Tr key={post.id}>
				<Table.Td>{pageSize * (activePage - 1) + index + 1}</Table.Td>
				<Table.Td>
					<a href={`/post/${post.id}`}>{post.title}</a>
				</Table.Td>
				<Table.Td>
					{format(new Date(post.postTime), "dd/MM/yyyy HH:mm")}
				</Table.Td>

				<Table.Td>{post.subjectCode}</Table.Td>
			</Table.Tr>
		));

	if (!user) {
		return <Text>Loading...</Text>;
	}

	if (loading) {
		return <Text>Loading...</Text>;
	}

	if (error) {
		return <div>Error: {error}</div>;
	}

	return (
		<>
			<Paper
				className="mx-10 mt-7"
				radius="md"
				withBorder
				p="lg"
				bg="var(--mantine-color-body)"
				style={{
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
				}}
			>
				<div style={{ display: "flex", alignItems: "center" }}>
					<MantineAvatar
						src={avatarUrl}
						size={120}
						radius={120}
						style={{
							border: "5px solid white",
						}}
					/>
					<Stack gap="xs" style={{ marginLeft: "20px" }}>
						<div style={{ display: "flex", alignItems: "center" }}>
							<Text size="xl" fw={700}>
								{user.firstName} {user.lastName}
							</Text>
							<Text
								style={{
									fontWeight: 700,
									color:
										user.status === "ACTIVE"
											? "#00FF00"
											: user.status === "BANNED"
											? "#FF0000"
											: "#000000",
									backgroundColor:
										user.status === "ACTIVE"
											? "#E0FFE0"
											: user.status === "BANNED"
											? "#FFE0E0"
											: "#F0F0F0",
									padding: "2px 5px",
									borderRadius: "5px",
									display: "flex",
									marginLeft: "10px",
									fontSize: "12px",
								}}
							>
								{user.status} MEMBER
								{user.status === "ACTIVE" ? (
									<IconUserCheck size={16} />
								) : (
									<IconLock size={16} />
								)}
							</Text>
						</div>
						<div style={{ display: "flex", alignItems: "center" }}>
							<Text
								style={{
									fontWeight: 700,
									color:
										user.role === "USER"
											? "#000000"
											: user.role === "STAFF"
											? "#0000FF"
											: user.role === "ADMIN"
											? "#FF0000"
											: "#000000",
									backgroundColor:
										user.role === "USER"
											? "#F0F0F0"
											: user.role === "STAFF"
											? "#E0E0FF"
											: user.role === "ADMIN"
											? "#FFE0E0"
											: "#F0F0F0",
									padding: "2px 5px",
									borderRadius: "10px",
									display: "flex",
									marginRight: "5px",
									fontSize: "12px",
								}}
							>
								{user.role === "ADMIN" ? (
									<IconShield size={16} />
								) : user.role === "STAFF" ? (
									<IconBriefcase size={16} />
								) : (
									<IconUser size={16} />
								)}
								{user.role}
							</Text>
						</div>
					</Stack>
				</div>

				<Stack>
					<Text style={{ display: "flex" }}>
						<IconFile size={16} /> {posts.length} posts
					</Text>
					<Text style={{ display: "flex" }}>
						<IconCalendarUser size={16} /> Enrolled on:{" "}
						{format(new Date(user.enrolledDate), "dd/MM/yyyy")}
					</Text>
				</Stack>
			</Paper>

			<Card className="mx-10" p="lg" withBorder>
				<Grid>
					<Grid.Col span={3}></Grid.Col>
					<Grid.Col span={5}>
						<div className="ml-auto flex items-center">
							<span className="mr-1">Subject: </span>{" "}
							<Select
								value={subjectFilter}
								onChange={(value) => setSubjectFilter(value || "All")}
								data={["All", ...subjectCodes]}
								placeholder="Filter by subject"
								className="w-full"
							/>
						</div>
					</Grid.Col>
					<Grid.Col span={4}>
						<TextInput
							value={search}
							onChange={(e) => setSearch(e.currentTarget.value)}
							placeholder="Search by title"
							className="w-full"
						/>
					</Grid.Col>
				</Grid>
				<Table>
					<Table.Thead>
						<Table.Tr>
							<Table.Th>#</Table.Th>
							<Table.Th>Title</Table.Th>
							<Table.Th>Post Time</Table.Th>
							<Table.Th>Subject Code</Table.Th>
						</Table.Tr>
					</Table.Thead>
					<Table.Tbody>{rows}</Table.Tbody>
				</Table>
				<Center className="mt-4">
					<Pagination
						value={activePage}
						onChange={setPage}
						total={numPage}
						radius="lg"
						withControls
					/>
				</Center>
			</Card>
		</>
	);
}
