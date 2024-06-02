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
import { Center, Pagination } from "@mantine/core";

interface Notification {
  createdAt: string;
  time: string;
  message: string;
}

function NotificationList() {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const username = "user1";
  const pageSize = 3;

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
      <Center mt={"lg"}>
        <Pagination value={activePage} onChange={setPage} total={numPage} />
      </Center>
    </Container>
  );
}

export default NotificationList;
