import { useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import { ActionIcon} from "@mantine/core";
import { IconPencil } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { Center, Pagination } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";



interface Post {
	username: string;
	subjectCode : string;
	title : string ;
	id : string ;
	test : string ;
	postTime : string ;
	role: string;
	status: string;
}


function TablePost() {
	const pageSize = 5;
	const [activePage, setPage] = useState(1);
	const [numPage, setNumPage] = useState(1);
	const [users, SetUsers] = useState<User[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const navigate = useNavigate();
	 const [currentTab, setCurrentTab] = useState("ALL");

	const [opened, { open, close }] = useDisclosure(false);
	useEffect(() => {
		async function fetchData() {
			try {
				const token = localStorage.getItem("token");
				const response = await fetch(
					`http://localhost:8080/api/v1/admin/getAllUser?pageNum=${activePage}&pageSize=${pageSize}`,
					{
						headers: {
							Authorization: `Bearer ${token}`,
						},
					}
				);

				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}

				const data: User[] = await response.json();
				console.log(data);
				SetUsers(data);
				setLoading(false);
			} catch (error: any) {
				setError(error.message);
				setLoading(false);
			}
		}
		        const fetchNum = async () => {
							// ${localStorage.getItem('username')}
							try {
								const response = await fetch(
									`http://localhost:8080/api/v1/admin/getNumUser`
								);
								const data = await response.json();
								setNumPage((data + 1) / pageSize);
							} catch (error) {
								console.error("Error fetching post:", error);
							}
						};
		fetchNum();			
		fetchData();
	}, [activePage]);


	if (loading) {
		return <div>Loading...</div>;
	}

	if (error) {
		return <div>Error: {error}</div>;
	}

	const handleGetUserClick = (username: string) => {
		navigate(`/user-detail/${username}`);
	};

	const All = users.map((user) => (
		<tr className="text-xs bg-gray-50" key={user.username}>
			<td
				className="flex items-center py-5 px-6 font-medium"
				onClick={() => handleGetUserClick(user.username)}
				style={{
					cursor: "pointer",
				}}
			>
				{user.username}
			</td>
			<td className="font-medium">{user.email}</td>
			<td></td>
			<td>
				<span
					className={`inline-block py-1 px-2 text-white rounded-full ${
						user.status === "ACTIVE"
							? "bg-green-500"
							: user.status === "BANNED"
							? "bg-red-500"
							: ""
					}`}
				>
					{user.status}
				</span>
			</td>
			<td className="font-medium">{user.role}</td>
			<td style={{ textAlign: "center" }}>
				<ActionIcon
					variant="gradient"
					size="lg"
					radius="xl"
					aria-label="Gradient action icon"
					gradient={{ from: "red", to: "cyan", deg: 90 }}
					onClick={open}
				>
					<IconPencil />
				</ActionIcon>
			</td>
		</tr>
	));

	const handleTabClick = (tab: string) => {
		setCurrentTab(tab);
	};

	return (
		<section className="py-8">
			<div className="container px-4 mx-auto">
				<div className="pt-6 bg-white shadow rounded">
					<div className="px-6 border-b">
						<div className="flex flex-wrap items-center mb-6">

							<h3 className="text-xl font-bold">POST MANAGEMENT</h3>
							<a
								className="ml-auto flex items-center py-2 px-3 text-xs text-white hover:bg-indigo-600 rounded"
								href="#"
							>
								<span className="mr-1">
									<SearchIcon style={{ fontSize: 30, color: "#AFABF1" }} />
								</span>
								<span style={{ display: "inline-block", width: "100%" }}>
									<input
										type="search"
										name=""
										id=""
										placeholder="Search User"
										style={{
											width: "100%",
											padding: "10px 15px",
											borderRadius: "25px",
											border: "1px solid #ccc",
											boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
											fontSize: "16px",
											outline: "none",
											transition: "border-color 0.3s, box-shadow 0.3s",
										}}
										onFocus={(e) => (e.target.style.borderColor = "#007BFF")}
										onBlur={(e) => (e.target.style.borderColor = "#ccc")}
									/>
								</span>
							</a>
						</div>
						<div>
							<a
								className={`inline-block px-4 pb-2 text-sm font-medium ${
									currentTab === "ALL"
										? "text-indigo-500 border-b-2 border-indigo-500"
										: "text-gray-500 border-b-2 border-transparent"
								}`}
								href="#"
								onClick={() => handleTabClick("ALL")}
							>

								Pending posts
							</a>
							<a
								className={`inline-block px-4 pb-2 text-sm font-medium ${
									currentTab === "Staffs"
										? "text-indigo-500 border-b-2 border-indigo-500"
										: "text-gray-500 border-b-2 border-transparent"
								}`}
								href="#"
								onClick={() => handleTabClick("Staffs")}
							>

								Active posts
							</a>
							<a
								className="inline-block px-4 pb-2 text-sm font-medium text-gray-500 border-b-2 border-transparent"
								href="#"
							>

								Hidden posts
							</a>
							<a
								className="inline-block px-4 pb-2 text-sm font-medium text-gray-500 border-b-2 border-transparent"
								href="#"
							>

								All posts
							</a>
						</div>
					</div>
					<div className="overflow-x-auto">
						<table className="table-auto w-full">
							<thead>
								<tr className="text-xs text-gray-500 text-left">
									<th className="flex items-center pl-6 py-4 font-medium">
										<a className="flex items-center" href="#">
											<span>Account </span>
											<span className="ml-2">
												<svg
													width="9"
													height="12"
													viewBox="0 0 9 12"
													fill="none"
													xmlns="http://www.w3.org/2000/svg"
												></svg>
											</span>
										</a>
									</th>
									<th className="py-4 font-medium">
										<a className="flex items-center" href="#">
											<span> Email </span>
											<span className="ml-2">
												<svg
													width="9"
													height="12"
													viewBox="0 0 9 12"
													fill="none"
													xmlns="http://www.w3.org/2000/svg"
												></svg>
											</span>
										</a>
									</th>
									<th className="py-4 font-medium">
										<a className="flex items-center" href="#">
											<span>Uploaded Posts</span>
											<span className="ml-2">
												<svg
													width="9"
													height="12"
													viewBox="0 0 9 12"
													fill="none"
													xmlns="http://www.w3.org/2000/svg"
												></svg>
											</span>
										</a>
									</th>
									<th className="py-4 font-medium">
										<a className="flex items-center" href="#">
											<span>Status</span>
											<span className="ml-2">
												<svg
													width="9"
													height="12"
													viewBox="0 0 9 12"
													fill="none"
													xmlns="http://www.w3.org/2000/svg"
												></svg>
											</span>
										</a>
									</th>
									<th className="py-4 font-medium">
										<a className="flex items-center" href="#">
											<span>Role</span>
											<span className="ml-2">
												<svg
													width="9"
													height="12"
													viewBox="0 0 9 12"
													fill="none"
													xmlns="http://www.w3.org/2000/svg"
												></svg>
											</span>
										</a>
									</th>
									<th className="py-4 font-medium" style={{ width: "5px" }}>
										<a className="flex items-center" href="#">
											<span>Options</span>
											<span className="ml-2">
												<svg
													width="9"
													height="12"
													viewBox="0 0 9 12"
													fill="none"
													xmlns="http://www.w3.org/2000/svg"
												></svg>
											</span>
										</a>
									</th>
								</tr>
							</thead>
							<tbody>{All}</tbody>
						</table>
					</div>

				</div>
				<Center mt={"lg"}>
					<Pagination value={activePage} onChange={setPage} total={numPage} />
				</Center>
			</div>
		</section>
	);
}
export default TablePost;
