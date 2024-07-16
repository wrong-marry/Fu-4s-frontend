import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Tabs } from "@mantine/core";

import {
	ScrollArea,
	Paper,
	Text,
	LoadingOverlay,
	Container,
	Box,
	Title,
	Space,
	Button,
	Modal,
	Group,
	Menu,
	ActionIcon,
} from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { Center, Pagination } from "@mantine/core";
import { IconDots, IconTrash, IconNote } from "@tabler/icons-react";
import { BASE_URL } from "../../common/constant.tsx";

interface Notification {
	id: string;
	time: string;
	message: string;
	seen: boolean;
	link: string;
}

function NotificationList() {
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const [activeTab, setActiveTab] = useState<string | null>("all");
	const navigate = useNavigate();
	const username = localStorage.getItem("username");
	const pageSize = 6;

	const [activePage, setPage] = useState(1);
	const [numPage, setNumPage] = useState(1);
	const [notifications, setNotifications] = useState<Notification[]>([]);
	const [unSeenNotifications, setUnSeenNotifications] = useState<
		Notification[]
	>([]);

	useEffect(() => {
		const fetchNoti = async () => {
			try {
				const response = await fetch(
					`${BASE_URL}/api/v1/notification/getAllByUsername?username=${username}&pageNum=${activePage}&pageSize=${pageSize}`
				);
				const data = await response.json();
				setNotifications(data);
				setLoading(false);
			} catch (error) {
				console.error("Error fetching notifications:", error);
				setError("Error fetching notifications");
				setLoading(false);
			}
		};

		const fetchUnSeenNoti = async () => {
			try {
				const response = await fetch(
					`${BASE_URL}/api/v1/notification/getAllByUsername?username=${username}&pageNum=${activePage}&pageSize=${pageSize}&seen=false`
				);
				const data = await response.json();
				setUnSeenNotifications(data);
				setLoading(false);
			} catch (error) {
				console.error("Error fetching notifications:", error);
				setError("Error fetching notifications");
				setLoading(false);
			}
		};

		const fetchNum = async () => {
			try {
				const response = await fetch(
					`${BASE_URL}/api/v1/notification/getNum?username=${username}`
				);
				const data = await response.json();
				setNumPage(Math.ceil(data / pageSize));
			} catch (error) {
				console.error("Error fetching notification count:", error);
				setError("Error fetching notification count");
			}
		};

		fetchNum();
		fetchNoti();
		fetchUnSeenNoti();
	}, [activePage, activeTab]);

	const markAsUnread = async (id: string) => {
		try {
			const response = await fetch(
				`${BASE_URL}/api/v1/notification/${id}/unseen`,
				{
					method: "PUT",
				}
			);

			if (response.ok) {
				const data = await response.json();
				setNotifications((prev) =>
					prev.map((noti) => (noti.id === id ? { ...noti, seen: false } : noti))
				);
			}
		} catch (error) {
			console.error("Error marking notification as unread:", error);
		}
	};

	const markAsRead = async (id: string) => {
		try {
			const response = await fetch(
				`${BASE_URL}/api/v1/notification/${id}/seen`,
				{
					method: "PUT",
				}
			);

			if (response.ok) {
				setNotifications((prevNotifications) =>
					prevNotifications.map((noti) =>
						noti.id === id ? { ...noti, seen: true } : noti
					)
				);

				setUnSeenNotifications((prev) => prev.filter((noti) => noti.id !== id));
			}
		} catch (error) {
			console.error("Error marking notification as read:", error);
		}
	};

	const deleteNoti = (id: string) => {
		const notificationToDelete = notifications.find((noti) => noti.id === id);
		if (!notificationToDelete) return;
		const originalIndex = notifications.findIndex((noti) => noti.id === id);
		setNotifications((prevNotifications) =>
			prevNotifications.filter((noti) => noti.id !== id)
		);
		setUnSeenNotifications((prevNotifications) =>
			prevNotifications.filter((noti) => noti.id !== id)
		);
		let shouldDelete = true;
		const toastId = toast(
			<div>
				<span>Notification removed.</span>
				<button
					style={{
						marginLeft: "10px",
						fontWeight: "bold",
						textDecoration: "underline",
						border: "none",
						background: "none",
						cursor: "pointer",
						color: "#007bff",
					}}
					onClick={() => {
						shouldDelete = false;
						setNotifications((prev) => {
							const newNotifications = [...prev];
							newNotifications.splice(originalIndex, 0, notificationToDelete);
							return newNotifications;
						});
						setUnSeenNotifications((prev) => {
							const newNotifications = [...prev];
							newNotifications.splice(originalIndex, 0, notificationToDelete);
							return newNotifications;
						});
						toast.dismiss(toastId);
					}}
				>
					Undo
				</button>
			</div>,
			{ autoClose: 3000, pauseOnHover: false }
		);
		setTimeout(async () => {
			if (shouldDelete) {
				try {
					const response = await fetch(
						`${BASE_URL}/api/v1/notification/${id}`,
						{
							method: "DELETE",
						}
					);
				} catch (error) {
					console.error("Error deleting notification:", error);
				}
			}
		}, 3000);
	};

	const [confirmModalOpen, setConfirmModalOpen] = useState(false);

	const handleMarkAllAsRead = async () => {
		try {
			setConfirmModalOpen(false);
			await fetch(`${BASE_URL}/api/v1/notification/markAllAsRead`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
			});
			setNotifications((prevNotifications) =>
				prevNotifications.map((noti) => ({ ...noti, seen: true }))
			);
			setUnSeenNotifications([]);
			toast.success("All notifications marked as read");
		} catch (error) {
			console.error("Error marking all notifications as read:", error);
			toast.error("Failed to mark all notifications as read");
		}
	};

	const handleNotificationClick = (link: string) => {
		navigate(link);
	};

	if (loading) {
		return <LoadingOverlay visible />;
	}

	if (error) {
		return <div>Error: {error}</div>;
	}

	return (
		<Container>
			<Space h="md" />
			<Group justify="space-between" mb="md">
				<Title order={3}>Notifications</Title>
				<Button size="xs" onClick={() => setConfirmModalOpen(true)}>
					Mark all as read
				</Button>
			</Group>
			<Tabs value={activeTab} onChange={setActiveTab}>
				<Tabs.List>
					<Tabs.Tab value="all">All</Tabs.Tab>
					<Tabs.Tab value="unread">Unread</Tabs.Tab>
				</Tabs.List>

				<Tabs.Panel value="all">
					<Box>
						<Paper withBorder>
							<ScrollArea>
								{notifications
									.filter((notification) =>
										[
											"APPROVED_POST",
											"DISAPPROVED_POST",
											"HIDE_COMMENT",
										].includes(notification.message)
									)
									.map((notification, index) => (
										<Box
											key={index}
											style={{
												display: "flex",
												justifyContent: "space-between",
												alignItems: "center",
												cursor: "pointer",
												padding: "10px",
												marginBottom: "10px",
												borderRadius: "4px",
												transition: "background-color 0.3s ease",
											}}
											onMouseEnter={(e) =>
												(e.currentTarget.style.backgroundColor = "#f0f0f0")
											}
											onMouseLeave={(e) =>
												(e.currentTarget.style.backgroundColor = "transparent")
											}
										>
											<Box
												onClick={() => handleNotificationClick(notification.id)}
											>
												<Text
													fw={notification.seen ? "" : "700"}
													onMouseEnter={(e) =>
														(e.currentTarget.style.textDecoration = "underline")
													}
													onMouseLeave={(e) =>
														(e.currentTarget.style.textDecoration = "none")
													}
												>
													{notification.message === "APPROVED_POST"
														? "Bài viết của bạn đã được duyệt"
														: notification.message === "DISAPPROVED_POST"
														? "Bài viết của bạn không được duyệt"
														: "Comment của bạn đã bị ẩn"}
												</Text>
												<Text size="xs" c="dimmed">
													{new Date(notification.time).toLocaleString()}
												</Text>
											</Box>
											<Menu withArrow position="bottom-end" withinPortal>
												<Menu.Target>
													<ActionIcon color="gray" variant="light">
														<IconDots size={16} />
													</ActionIcon>
												</Menu.Target>
												<Menu.Dropdown>
													{notification.seen ? (
														<Menu.Item
															onClick={() => markAsUnread(notification.id)}
															leftSection={<IconNote />}
														>
															Mark as unread
														</Menu.Item>
													) : (
														<Menu.Item
															onClick={() => markAsRead(notification.id)}
															leftSection={<IconNote />}
														>
															Mark as read
														</Menu.Item>
													)}
													<Menu.Item
														onClick={() => deleteNoti(notification.id)}
														leftSection={<IconTrash />}
														color="red"
													>
														Delete notification
													</Menu.Item>
												</Menu.Dropdown>
											</Menu>
										</Box>
									))}
							</ScrollArea>
						</Paper>
						<Center mt={"lg"}>
							<Pagination
								value={activePage}
								onChange={setPage}
								total={numPage}
							/>
						</Center>
					</Box>
				</Tabs.Panel>

				<Tabs.Panel value="unread">
					<Box>
						<Paper withBorder>
							<ScrollArea>
								{unSeenNotifications
									.filter((notification) =>
										[
											"APPROVED_POST",
											"DISAPPROVED_POST",
											"HIDE_COMMENT",
										].includes(notification.message)
									)
									.map((notification, index) => (
										<Box
											key={index}
											style={{
												display: "flex",
												justifyContent: "space-between",
												alignItems: "center",
												cursor: "pointer",
												padding: "10px",
												marginBottom: "10px",
												borderRadius: "4px",
												transition: "background-color 0.3s ease",
											}}
											onMouseEnter={(e) =>
												(e.currentTarget.style.backgroundColor = "#f0f0f0")
											}
											onMouseLeave={(e) =>
												(e.currentTarget.style.backgroundColor = "transparent")
											}
										>
											<Box
												onClick={() => handleNotificationClick(notification.id)}
											>
												<Text
													fw={notification.seen ? "" : "700"}
													onMouseEnter={(e) =>
														(e.currentTarget.style.textDecoration = "underline")
													}
													onMouseLeave={(e) =>
														(e.currentTarget.style.textDecoration = "none")
													}
												>
													{notification.message === "APPROVED_POST"
														? "Bài viết của bạn đã được duyệt"
														: notification.message === "DISAPPROVED_POST"
														? "Bài viết của bạn không được duyệt"
														: "Comment của bạn đã bị ẩn"}
												</Text>
												<Text size="xs" c="dimmed">
													{new Date(notification.time).toLocaleString()}
												</Text>
											</Box>
											<Menu withArrow position="bottom-end" withinPortal>
												<Menu.Target>
													<ActionIcon color="gray" variant="light">
														<IconDots size={16} />
													</ActionIcon>
												</Menu.Target>
												<Menu.Dropdown>
													{notification.seen ? (
														<Menu.Item
															onClick={() => markAsUnread(notification.id)}
															leftSection={<IconNote />}
														>
															Mark as unread
														</Menu.Item>
													) : (
														<Menu.Item
															onClick={() => markAsRead(notification.id)}
															leftSection={<IconNote />}
														>
															Mark as read
														</Menu.Item>
													)}
													<Menu.Item
														onClick={() => deleteNoti(notification.id)}
														leftSection={<IconTrash />}
														color="red"
													>
														Delete notification
													</Menu.Item>
												</Menu.Dropdown>
											</Menu>
										</Box>
									))}
							</ScrollArea>
						</Paper>
						<Center mt={"lg"}>
							<Pagination
								value={activePage}
								onChange={setPage}
								total={numPage}
							/>
						</Center>
					</Box>
				</Tabs.Panel>
			</Tabs>

			<Modal
				opened={confirmModalOpen}
				onClose={() => setConfirmModalOpen(false)}
				title="Confirm Action"
			>
				<Text>Are you sure you want to mark all notifications as read?</Text>
				<Group justify="flex-end" gap="sm" mt="md">
					<Button onClick={() => setConfirmModalOpen(false)}>Cancel</Button>
					<Button onClick={handleMarkAllAsRead}>OK</Button>
				</Group>
			</Modal>
		</Container>
	);
}

export default NotificationList;
