import React, { useState, useEffect } from "react";
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
import { IconDots } from "@tabler/icons-react";
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
  const [activeTab, setActiveTab] = useState("all");
  const navigate = useNavigate();
  const username = "user1";
  const pageSize = 6;

  const [activePage, setPage] = useState(1);
  const [numPage, setNumPage] = useState(1);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const fetchNoti = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/v1/notification/getAllByUsername?username=${username}&pageNum=${activePage}&pageSize=${pageSize}`
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

    const fetchNum = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/v1/notification/getNum?username=${username}`
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
  }, [activePage]);

  const markAsUnread = async (id: string) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/v1/notification/${id}/unseen`,
        {
          method: "PUT",
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.message === "Notification marked as unseen successfully") {
          setNotifications((prevNotifications) =>
            prevNotifications.map((noti) =>
              noti.id === id ? { ...noti, seen: false } : noti
            )
          );
        } else {
          console.error("Error marking notification as unread:", data.message);
        }
      } else {
        console.error(
          "Error marking notification as unread:",
          response.statusText
        );
      }
    } catch (error) {
      console.error("Error marking notification as unread:", error);
    }
  };

  const [confirmModalOpen, setConfirmModalOpen] = useState(false);

  const handleMarkAllAsRead = async () => {
    try {
      setConfirmModalOpen(false);
      await fetch(`http://localhost:8080/api/v1/notification/markAllAsRead`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });
      setNotifications((prevNotifications) =>
        prevNotifications.map((noti) => ({ ...noti, seen: true }))
      );
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
        <Title order={1}>Notifications</Title>
        <Button onClick={() => setConfirmModalOpen(true)}>
          Mark all as read
        </Button>
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
      </Group>
      <Box>
        <Paper withBorder>
          <ScrollArea>
            {notifications
              .filter((notification) =>
                ["APPROVED_POST", "DISAPPROVED_POST", "HIDE_COMMENT"].includes(
                  notification.message
                )
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
                  <Box onClick={() => handleNotificationClick(notification.id)}>
                    <Text
                      // w={notification.seen ? "normal" : "bold"}
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
                    <Text size="xs" color="dimmed">
                      {new Date(notification.time).toLocaleString()}
                    </Text>
                  </Box>
                  <Menu position="left" withArrow trigger="hover">
                    <Menu.Target>
                      <ActionIcon color="gray" variant="light">
                        <IconDots size={16} />
                      </ActionIcon>
                    </Menu.Target>
                    <Menu.Dropdown>
                      <Menu.Item onClick={() => markAsUnread(notification.id)}>
                        Mark as unread
                      </Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                </Box>
              ))}
          </ScrollArea>
        </Paper>
      </Box>
      <Center mt={"lg"}>
        <Pagination value={activePage} onChange={setPage} total={numPage} />
      </Center>
    </Container>
  );
}

export default NotificationList;
