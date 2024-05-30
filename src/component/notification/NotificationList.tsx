import React, { useState, useEffect } from "react";
import {
  ScrollArea,
  Paper,
  Text,
  LoadingOverlay,
  Container,
  Box,
} from "@mantine/core";
import { useNavigate, useParams } from "react-router-dom";

interface Notification {
  createdAt: string;
  time: string;
  message: string;
}

function NotificationList() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { username } = useParams<{ username: string }>();

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(
          `http://localhost:8080/api/v1/notification/getAll`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: Notification[] = await response.json();
        setNotifications(data);
        setLoading(false);
      } catch (error: any) {
        setError(error.message);
        setLoading(false);
      }
    }
    fetchData();
  }, [username]);

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
      <Box>
        <Paper withBorder shadow="md" p="md">
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
                  onClick={() => handleNotificationClick(notification.message)}
                >
                  <Text
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
              ))}
          </ScrollArea>
        </Paper>
      </Box>
    </Container>
  );
}

export default NotificationList;
