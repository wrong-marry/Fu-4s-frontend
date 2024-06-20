import { useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import { Center, Pagination, TextInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { Group, ActionIcon, Menu, rem } from "@mantine/core";
import {
	IconTrash,
	IconDots,
	IconCheck,
	IconEyeOff,
	IconRestore,
} from "@tabler/icons-react";
import ModalConfirm from "./ModalConfirm";



interface Post {
	id: string;
	subjectCode : string;
	title : string ;
	test : string ;
	postTime : string ;
	status: string;
}


function TablePostStaff() {
	const pageSize = 5;
	const [search, setSearch] = useState("");
	const [activePage, setPage] = useState(1);
	const [numPage, setNumPage] = useState(1);
	const [posts, SetPosts] = useState<Post[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const navigate = useNavigate();
	 const [currentTab, setCurrentTab] = useState("All posts");
	 const [sortBy, setSortBy] = useState<string | null>(null);
		const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");


	  const [postToApproved, setpostToApproved] = useState<Post | null>(null);
		const [postToDenied, setpostToDenied] = useState<Post | null>(null);

		 const [
				pendingPostOpened,
				{ open: openModalConfirm, close: closeModalConfirm },
			] = useDisclosure(false);

			const confirmApprovedPost = async () => {
				if (postToApproved) {
					try {
						const token = localStorage.getItem("token");
						const response = await fetch(
							`http://localhost:8080/api/v1/staff/approvedPost?id=${postToApproved.id}`,
							{
								method: "PUT",
								headers: {
									Authorization: `Bearer ${token}`,
									"Content-Type": "application/json",
								},
							}
						);

						if (response.ok) {
							SetPosts((prevPosts) =>
								prevPosts.map((post) =>
									post.id === postToApproved.id
										? {
												...post,
												status:
													postToApproved.status === "PENDING_APPROVE"
														? "ACTIVE"
														: "PENDING_APPROVE",
										  }
										: post
								)
							);
							closeModalConfirm();
							notifications.show({
								title: `Change Post Status`,
								message: `"${postToApproved.id}" has been approved!`,
								color: "green",
							});
						}
					} catch (error) {
						console.error("Error changing Post status:", error);
						notifications.show({
							title: "Error changing Post status",
							message: `An unknown error occurred while changing status for "${postToApproved.id}"`,
							color: "red",
						});
					}
				}
			};

			const confirmDeniedPost = async () => {
				if (postToDenied) {
					try {
						const token = localStorage.getItem("token");
						const response = await fetch(
							`http://localhost:8080/api/v1/staff/deniedPost?id=${postToDenied.id}`,
							{
								method: "PUT",
								headers: {
									Authorization: `Bearer ${token}`,
									"Content-Type": "application/json",
								},
							}
						);

						if (response.ok) {
							SetPosts((prevPosts) =>
								prevPosts.map((post) =>
									post.id === postToDenied.id
										? {
												...post,
												status:
													postToDenied.status === "PENDING_APPROVE"
														? "HIDDEN"
														: "PENDING_APPROVE",
										  }
										: post
								)
							);
						closeModalConfirm();
						notifications.show({
							title: `Change Post Status`,
							message: `"${postToDenied.id}" has been denied!`,
							color: "red",
						});
						}
					} catch (error) {
						console.error("Error changing Post status:", error);
						notifications.show({
							title: "Error changing Post status",
							message: `An unknown error occurred while changing status for "${postToDenied.id}"`,
							color: "red",
						});
					}
				}
			};


	 useEffect(() => {
			const fetchNum = async () => {
				try {
					const token = localStorage.getItem("token");
					const baseURL = "http://localhost:8080/api/v1/staff";
					let url = "";

					if (currentTab === "All posts") {
						url = `${baseURL}/getNumAllPost`;
					} else if (currentTab === "Pending posts") {
						url = `${baseURL}/getNumEachStatus?status=PENDING_APPROVE`;
					} else if (currentTab === "Active posts") {
						url = `${baseURL}/getNumEachStatus?status=ACTIVE`;
					} else if (currentTab === "Hidden posts") {
						url = `${baseURL}/getNumEachStatus?status=HIDDEN`;
					}
					const response = await fetch(url, {
						headers: {
							Authorization: `Bearer ${token}`,
						},
					});
					if (!response.ok) {
						if (response.status === 500) {
							navigate("/forbidden");
							return;
						}
						throw new Error("Network response was not ok");
					}

					const data = await response.json();
					setNumPage(Math.ceil((data + 1) / pageSize));
				} catch (error) {
					console.error("Error fetching post:", error);
					navigate("/forbidden");
				}
			};

			const fetchData = async (url: string) => {
				try {
					const token = localStorage.getItem("token");
					const response = await fetch(url, {
						headers: {
							Authorization: `Bearer ${token}`,
						},
					});

					if (!response.ok) {
						if (response.status === 500) {
							navigate("/forbidden");
							return;
						}
						throw new Error(`HTTP error! status: ${response.status}`);
					}

					const data: Post[] = await response.json();
					SetPosts(data);
					setLoading(false);
				} catch (error: any) {
					setError(error.message);
					setLoading(false);
					if (error.message.includes("500")) {
						navigate("/forbidden");
					}
				}
			};

			const baseURL = "http://localhost:8080/api/v1/staff";
			let url = "";

			if (currentTab === "All posts") {
				url = `${baseURL}/getAllPosts?pageNum=${activePage}&pageSize=${pageSize}`;
			} else if (currentTab === "Pending posts") {
				url = `${baseURL}/getAllByPostStatus?status=PENDING_APPROVE&pageNum=${activePage}&pageSize=${pageSize}`;
			} else if (currentTab === "Active posts") {
				url = `${baseURL}/getAllByPostStatus?status=ACTIVE&pageNum=${activePage}&pageSize=${pageSize}`;
			} else if (currentTab === "Hidden posts") {
				url = `${baseURL}/getAllByPostStatus?status=HIDDEN&pageNum=${activePage}&pageSize=${pageSize}`;
			}
			fetchData(url);
			fetchNum();
		}, [activePage, currentTab]);

		useEffect(() => {
			setPage(1);
		}, [currentTab]);

		if (loading) {
			return <div>Loading...</div>;
		}

		if (error) {
			return <div>Error: {error}</div>;
		}

		const handleGetPostClick = (Postname: string) => {
			navigate(`/Post-detail/${Postname}`);
		};

		const handleApprovedPost = (post: Post) => {
			setpostToApproved(post);
			openModalConfirm();
		};

		const handleDeniedPost = (post: Post) => {
			setpostToDenied(post);
			openModalConfirm();
		};

		const handleHidePost = (post: Post) => {
			// Implement the hide post logic here
		};

		const handleDeletePost = (post: Post) => {
			// Implement the delete post logic here
		};

		const handleRestorePost = (post: Post) => {
			// Implement the restore post logic here
		};

		const PendingPost = posts.map((post) => (
			<tr className="text-xs bg-gray-50" key={post.id}>
				<td
					className="flex items-center py-5 px-6 font-medium"
					onClick={() => handleGetPostClick(post.id)}
					style={{
						cursor: "pointer",
					}}
				>
					{post.id}
				</td>
				<td className="font-medium">{post.subjectCode}</td>
				<td>{post.title}</td>
				<td>
					<span
						className={`inline-block py-1 px-2 text-white rounded-full ${
							post.status === "ACTIVE"
								? "bg-green-500"
								: post.status === "HIDDEN"
								? "bg-red-500"
								: post.status === "PENDING_APPROVE"
								? "bg-yellow-500"
								: ""
						}`}
					>
						{post.status}
					</span>
				</td>
				<td className="font-medium">{post.postTime}</td>
				<td style={{ textAlign: "center" }}>
					<Group gap={0} justify="flex-end">
						<Menu
							transitionProps={{ transition: "pop" }}
							withArrow
							position="bottom-end"
							withinPortal
						>
							<Menu.Target>
								<ActionIcon variant="subtle" color="gray">
									<IconDots
										style={{ width: rem(16), height: rem(16) }}
										stroke={1.5}
									/>
								</ActionIcon>
							</Menu.Target>
							<Menu.Dropdown>
								{currentTab === "Pending posts" && (
									<>
										<Menu.Item
											leftSection={
												<IconCheck
													style={{ width: rem(16), height: rem(16) }}
													stroke={1.5}
												/>
											}
											onClick={() => handleApprovedPost(post)}
										>
											Approved Posting
										</Menu.Item>
										<Menu.Item
											leftSection={
												<IconTrash
													style={{ width: rem(16), height: rem(16) }}
													stroke={1.5}
												/>
											}
											onClick={() => handleDeniedPost(post)}
										>
											Denied Posting
										</Menu.Item>
									</>
								)}
								{currentTab === "Active posts" && (
									<Menu.Item
										leftSection={
											<IconEyeOff
												style={{ width: rem(16), height: rem(16) }}
												stroke={1.5}
											/>
										}
										onClick={() => handleHidePost(post)}
									>
										Hide Posting
									</Menu.Item>
								)}
								{currentTab === "Hidden posts" && (
									<>
										<Menu.Item
											leftSection={
												<IconTrash
													style={{ width: rem(16), height: rem(16) }}
													stroke={1.5}
												/>
											}
											onClick={() => handleDeletePost(post)}
										>
											Delete Posting
										</Menu.Item>
										<Menu.Item
											leftSection={
												<IconRestore
													style={{ width: rem(16), height: rem(16) }}
													stroke={1.5}
												/>
											}
											onClick={() => handleRestorePost(post)}
										>
											Restore Posting
										</Menu.Item>
									</>
								)}
							</Menu.Dropdown>
						</Menu>
					</Group>
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
								className="ml-auto flex items-center py-2 px-3 text-xs text-white "
								href="#"
							>
								<span className="mr-1">
									<SearchIcon style={{ fontSize: 30, color: "#AFABF1" }} />
								</span>
								<TextInput
									placeholder="Search by Post ID or Title"
									value={search}
									onChange={(e) => setSearch(e.currentTarget.value)}
									style={{ marginRight: "1rem", width: "200px" }}
								/>
							</a>
						</div>
						<div>
							<a
								className={`inline-block px-4 pb-2 text-sm font-medium ${
									currentTab === "All posts"
										? "text-indigo-500 border-b-2 border-indigo-500"
										: "text-gray-500 border-b-2 border-transparent"
								}`}
								href="#"
								onClick={() => handleTabClick("All posts")}
							>
								All posts
							</a>
							<a
								className={`inline-block px-4 pb-2 text-sm font-medium ${
									currentTab === "Pending posts"
										? "text-indigo-500 border-b-2 border-indigo-500"
										: "text-gray-500 border-b-2 border-transparent"
								}`}
								href="#"
								onClick={() => handleTabClick("Pending posts")}
							>
								Pending posts
							</a>
							<a
								className={`inline-block px-4 pb-2 text-sm font-medium ${
									currentTab === "Hidden posts"
										? "text-indigo-500 border-b-2 border-indigo-500"
										: "text-gray-500 border-b-2 border-transparent"
								}`}
								href="#"
								onClick={() => handleTabClick("Hidden posts")}
							>
								Hidden posts
							</a>
							<a
								className={`inline-block px-4 pb-2 text-sm font-medium ${
									currentTab === "Active posts"
										? "text-indigo-500 border-b-2 border-indigo-500"
										: "text-gray-500 border-b-2 border-transparent"
								}`}
								href="#"
								onClick={() => handleTabClick("Active posts")}
							>
								Active posts
							</a>
						</div>
					</div>
					<div className="overflow-x-auto">
						<table className="table-auto w-full">
							<thead>
								<tr className="text-xs text-gray-500 text-left">
									<th className="flex items-center pl-6 py-4 font-medium">
										<a className="flex items-center" href="#">
											<span>Post ID </span>
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
											<span> Subject </span>
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
											<span>Title</span>
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
											<span>Type</span>
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
											<span>Post Time</span>
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
							<tbody>{PendingPost}</tbody>
						</table>
					</div>
				</div>
				<Center mt={"lg"}>
					<Pagination value={activePage} onChange={setPage} total={numPage} />
				</Center>
				<ModalConfirm
					opened={pendingPostOpened}
					onClose={closeModalConfirm}
					onConfirm={confirmApprovedPost}
					postToPending={postToApproved}
				/>
			</div>
		</section>
	);
}
export default TablePostStaff ;
