import * as React from "react";
import { NavLink } from "react-router-dom";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { Menu, ActionIcon } from "@mantine/core";
import NotificationList from "./NotificationList";

const NotificationCard: React.FC = () => {
  return (
    <>
      <Menu shadow="md" width={200} closeOnClickOutside={false}>
        <Menu.Target>
          <ActionIcon variant="default" aria-label="Notification">
            <NotificationsIcon />
          </ActionIcon>
        </Menu.Target>

        <Menu.Dropdown
          style={{
            maxHeight: "400px",
            overflowY: "auto",
            width: "400px",
          }}
        >
          <NotificationList />
          <div style={{ textAlign: "center", padding: "10px" }}>
            <NavLink
              to="/notifications"
              style={{ textDecoration: "none", color: "#007bff" }}
            >
              See all
            </NavLink>
          </div>
        </Menu.Dropdown>
      </Menu>
    </>
  );
};

export default NotificationCard;
