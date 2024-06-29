import { useEffect, useState } from "react";
import {
  Group,
  Code,
  useComputedColorScheme,
  Menu,
  Popover,
  rem,
  Grid,
  em,
  useMantineColorScheme,
  Center,
  Text,
} from "@mantine/core";
import {
  IconBellRinging,
  IconFingerprint,
  IconKey,
  IconSettings,
  Icon2fa,
  IconDatabaseImport,
  IconReceipt2,
  IconSwitchHorizontal,
  IconLogout,
  IconHome,
  IconLibraryPlus,
  IconPhoto,
  IconSquarePlus,
  IconChartBar,
  IconUsers,
  IconBook,
  IconEyeCheck,
  IconFileText,
} from "@tabler/icons-react";

import classes from "./NavbarSimple.module.css";
import { NavLink, useNavigate } from "react-router-dom";
import NotificationList from "../../notification/NotificationList";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { Logout } from "../../../util/loader/Auth";
import { DarkModeSwitch } from "react-toggle-dark-mode";

export function NavbarSimple() {
  const [, { open }] = useDisclosure(false);
  const [active, setActive] = useState("home");
  const computedColorScheme = useComputedColorScheme("light");
  const navigate = useNavigate();
  const isMobile = useMediaQuery(`(max-width: ${em(769)})`);
  const { colorScheme, setColorScheme } = useMantineColorScheme({
    keepTransitions: true,
  });
  const toggleColorScheme = () => {
    setColorScheme(computedColorScheme === "dark" ? "light" : "dark");
  };
  return (
    <nav className={classes.navbar}>
      <div className={classes.navbarMain}>
        <a
          className={classes.link}
          data-active={"home" === active || undefined}
          onClick={(event) => {
            event.preventDefault();
            setActive("home");
            navigate("home");
          }}
        >
          <IconHome className={classes.linkIcon} stroke={1.5} />
          <span>Home</span>
        </a>
        <Menu
          trigger="hover"
          position={!isMobile ? "right-start" : "bottom-end"}
          withArrow
          shadow="md"
          width={350}
        >
          <Menu.Target>
            <a
            onClick={()=>{navigate("/notifications");setActive("notifications");}}
              className={classes.link}
              data-active={"notifications" === active || undefined}
            >
              <IconBellRinging className={classes.linkIcon} stroke={1.5} />
              <span>Notifications</span>
            </a>
          </Menu.Target>

          <Menu.Dropdown>
            <NotificationList />
            <div style={{ textAlign: "center", padding: "10px" }}>
              <NavLink
                onClick={() => setActive("notifications")}
                to="/notifications"
                style={{ textDecoration: "none", color: "#007bff" }}
              >
                See all
              </NavLink>
            </div>
          </Menu.Dropdown>
        </Menu>

        <Menu
          trigger="hover"
          shadow="md"
          position={!isMobile ? "right-start" : "bottom-end"}
          withArrow
          width={200}
        >
          <Menu.Target>
            <a
              className={classes.link}
              data-active={"create" === active || undefined}
            >
              <IconSquarePlus className={classes.linkIcon} stroke={1.5} />
              <span>Generate</span>
            </a>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Label>Create</Menu.Label>
            <NavLink
              to={"/create-mock-test"}
              onClick={() => setActive("create")}
            >
              <Menu.Item
                leftSection={
                  <IconLibraryPlus
                    style={{ width: rem(14), height: rem(14) }}
                  />
                }
              >
                Mock Test
              </Menu.Item>
            </NavLink>

            <NavLink
              to={"/create-learning-material"}
              onClick={() => setActive("create")}
            >
              <Menu.Item
                onClick={open}
                leftSection={
                  <IconPhoto style={{ width: rem(14), height: rem(14) }} />
                }
              >
                Learning material
              </Menu.Item>
            </NavLink>
          </Menu.Dropdown>
        </Menu>
        
      </div>
      <div className={classes.footer}>
        <Text ml='sm'>Admin workspace</Text>
        <a className={classes.link} onClick={() => navigate("/admin/overview")}>
          <IconChartBar className={classes.linkIcon} stroke={1.5} />
          <span>Overview Charts</span>
        </a>
        <a className={classes.link} onClick={() => navigate("/admin/manage-users")}>
          <IconUsers className={classes.linkIcon} stroke={1.5} />
          <span>Manage users</span>
        </a>
        <a className={classes.link} onClick={() => navigate("/admin/manage-subjects")}>
          <IconBook className={classes.linkIcon} stroke={1.5} />
          <span>Manage subjects</span>
        </a>
        <a className={classes.link} onClick={() => navigate("/admin/staff-monitoring")}>
          <IconEyeCheck className={classes.linkIcon} stroke={1.5} />
          <span>Staff monitoring</span>
          
        </a>
        <a className={classes.link} onClick={() => navigate("/admin/pending-posts")}>
          <IconFileText className={classes.linkIcon} stroke={1.5} />
          <span>Pending posts</span>
        </a>
      </div>
      <div className={classes.footer}>
        <a className={classes.link} onClick={() => Logout()}>
          <IconLogout className={classes.linkIcon} stroke={1.5} />
          <span>Logout</span>
        </a>
      </div>
    </nav>
  );
}
