import { useState, useEffect } from "react";
import { Tabs } from "@mantine/core";

import { Paper, Text, LoadingOverlay, Container, Box } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../common/constant.tsx";

interface Notification {
	id: string;
	time: string;
	message: string;
	seen: boolean;
	postId: string;
}

function NotificationListSmall() {
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const [activeTab, setActiveTab] = useState<string | null>("all");
	const navigate = useNavigate();
	const username = localStorage.getItem("username");
	const pageSize = 6;
	const [notifications, setNotifications] = useState<Notification[]>([]);
	const [unSeenNotifications, setUnSeenNotifications] = useState<
		Notification[]
	>([]);

	useEffect(() => {
		const fetchNoti = async () => {
			try {
				const response = await fetch(
					`${BASE_URL}/api/v1/notification/getAllByUsername?username=${username}&pageNum=1&pageSize=${pageSize}`
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
					`${BASE_URL}/api/v1/notification/getAllByUsername?username=${username}&pageNum=1&pageSize=${pageSize}&seen=false`
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

		fetchNoti();
		fetchUnSeenNoti();
	}, [activeTab]);

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

	if (loading) {
		return <LoadingOverlay visible />;
	}

	if (error) {
		return <div>Error: {error}</div>;
	}

	return (
		<Container>
			<Tabs value={activeTab} onChange={setActiveTab}>
				<Tabs.List>
					<Tabs.Tab value="all">All</Tabs.Tab>
					<Tabs.Tab value="unread">Unread</Tabs.Tab>
				</Tabs.List>

				<Tabs.Panel value="all">
					<Box>
						<Paper withBorder>
							{notifications.map((notification, index) => (
								<Box
									key={index}
									style={{
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
										onClick={() => {
											navigate(`/post/${notification.postId}`);
											markAsRead(notification.id);
										}}
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
											{notification.message}
										</Text>
									</Box>
								</Box>
							))}
						</Paper>
					</Box>
				</Tabs.Panel>

				<Tabs.Panel value="unread">
					<Box>
						<Paper withBorder>
							{unSeenNotifications.map((notification, index) => (
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
										onClick={() => {
											navigate(`/post/${notification.postId}`);
											markAsRead(notification.id);
										}}
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
											{notification.message}
										</Text>
									</Box>
								</Box>
							))}
						</Paper>
					</Box>
				</Tabs.Panel>
			</Tabs>
		</Container>
	);
}

export default NotificationListSmall;
