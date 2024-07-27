import React, { useState, useEffect } from "react";
import axios from "axios";
import { Text, Container, Title, Button, Center, Card, CardSection, Divider, Group, Box } from "@mantine/core";
import LearningMaterialDetail from "../../user-post/learning-material/LearningMaterialDetail";
import MockTestDetailPage from "../../../page/mock-test-detail-page/MockTestDetailPage";
import { useDisclosure } from "@mantine/hooks";
import ModalConfirm from "./ModalConfirm";
import { notifications } from "@mantine/notifications";
import ModalDenied from "./ModalDenied";

export interface Post {
	id: number;
	postTime: string;
	title: string;
	status: string | null;
	username: string;
	subjectCode: string;
	test: boolean;
}
interface ComponentProps {
	flag: boolean;
	setFlag: React.Dispatch<React.SetStateAction<boolean>>;
}

const PostPage1: React.FC<ComponentProps> = ({ flag, setFlag }) => {
	const [post, setPost] = useState<Post | null>(null);
	const [, setPosts] = useState<Post[] | null>(null);
	const [postToApproved, setpostToApproved] = useState<Post | null>(null);
	const [postToDenied, setpostToDenied] = useState<Post | null>(null);

	const [
		pendingPostOpened,
		{ open: openModalConfirm, close: closeModalConfirm },
	] = useDisclosure(false);
	const [
		pendingPostDenied,
		{ open: openModalDenied, close: closeModalDenied },
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
					setPosts(
						(prevPosts) =>
							prevPosts?.map((post) =>
								post.id === postToApproved.id
									? {
											...post,
											status:
												postToApproved.status === "PENDING_APPROVE"
													? "ACTIVE"
													: "PENDING_APPROVE",
									  }
									: post
							) || []
					);
                    setFlag(!flag);
					closeModalConfirm();
					notifications.show({
						title: `Change Post Status`,
						message: `"${postToApproved.id}" has been approved!`,
						color: "green",
					});
					fetchNextPendingPost();
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
					setPosts(
						(prevPosts) =>
							prevPosts?.map((post) =>
								post.id === postToDenied.id
									? {
											...post,
											status:
												postToDenied.status === "PENDING_APPROVE"
													? "HIDDEN"
													: "PENDING_APPROVE",
									  }
									: post
							) || []
					);
                    setFlag(!flag);
					closeModalDenied();
					notifications.show({
						title: `Change Post Status`,
						message: `"${postToDenied.id}" has been denied!`,
						color: "red",
					});
					fetchNextPendingPost();
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

	const fetchPost = async () => {
		const response: Post = (
			await axios.get(`http://localhost:8080/api/v1/post/get-pending`)
		).data;
		setPost(response);
                                         setFlag(!flag);

	};

	const fetchNextPendingPost = async () => {
		try {
			const response = await axios.get(
				`http://localhost:8080/api/v1/post/get-pending`
			);
			setPost(response.data); 
            // Cập nhật state `post` với bài post mới
		} catch (error) {
			console.error("Error fetching next pending post:", error);
		}
	};
	useEffect(() => {
		fetchPost();
	}, [flag]);

	const handleApprovedPost = (post: Post) => {
		setpostToApproved(post);
		openModalConfirm();
	};

	const handleDeniedPost = (post: Post) => {
		setpostToDenied(post);
		openModalDenied();
	};

	return (
		<Center>
			<Container size={"xl"} mt={"xl"}>
				{post ? (
					<Card withBorder shadow="sm" padding="xl">
						<CardSection>
							<Title order={2} ta={"center"} component="div" mb={2} p={"md"}>
								<div className="flex items-center justify-center space-x-2">
									<Text size="l" fw={800} m="20">
										<span className="text-orange-500">Pending posts :</span>
									</Text>
									
								</div>
							</Title>
						</CardSection>
						<Divider size="xs" />
					
						<CardSection>
							<Box w={830}>
								{!post?.test && <LearningMaterialDetail id={post?.id} />}
								{post?.test && <MockTestDetailPage {...post} />}
							</Box>
						</CardSection>
						<CardSection>
							<Box w={830}>
								<Divider my="sm" variant="dotted" />

								<Group display="flex" justify="space-around" m={2}>
									<Button
										onClick={() => handleApprovedPost(post)}
										variant="light"
										className="bg-green-500 text-white hover:bg-green-700"
										size="xs"
									>
										APPROVE
									</Button>
									<Button
										onClick={() => handleDeniedPost(post)}
										variant="light"
										className="bg-red-500 text-white hover:bg-red-700"
										size="xs"
									>
										DENY
									</Button>
								</Group>
							</Box>
						</CardSection>
						<Divider my="sm" variant="dotted" />
					</Card>
				) : (
					<Text>No pending posts</Text>
				)}
			</Container>
			<ModalConfirm
				opened={pendingPostOpened}
				onClose={closeModalConfirm}
				onConfirm={confirmApprovedPost}
			/>
			<ModalDenied
				opened={pendingPostDenied}
				onClose={closeModalDenied}
				onConfirm={confirmDeniedPost}
			/>
		</Center>
	);
};

export default PostPage1;
