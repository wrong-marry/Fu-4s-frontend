import React, { useState, useEffect } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useNavigate, useParams } from "react-router-dom";
import { TableCell, Typography } from "@mui/material";

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
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Paper>
      <TableContainer>
        <Table>
          <TableBody>
            {notifications
              .filter((notification) =>
                ["APPROVED_POST", "DISAPPROVED_POST", "HIDE_COMMENT"].includes(
                  notification.message
                )
              )
              .map((notification, index) => (
                <TableRow
                  key={index}
                  // onClick={() => handleNotificationClick(notification.link)}
                  style={{
                    cursor: "pointer",
                  }}
                >
                  <TableCell>
                    <Typography variant="body1">
                      {notification.message === "APPROVED_POST"
                        ? "Bài viết của bạn đã được duyệt"
                        : notification.message === "DISAPPROVED_POST"
                        ? "Bài viết của bạn không được duyệt"
                        : "Comment của bạn đã bị ẩn"}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: "0.8rem",
                      }}
                    >
                      {new Date(notification.time).toLocaleString()}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

export default NotificationList;
