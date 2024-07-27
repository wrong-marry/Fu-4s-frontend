import { useState } from "react";
import { Menu, rem, em, Text, Container, Title, Group } from "@mantine/core";
import {
	IconBellRinging,
	IconLogout,
	IconHome,
	IconLibraryPlus,
	IconPhoto,
	IconSquarePlus,
	IconChartBar,
	IconUsers,
	IconBook,
	IconFileText,
} from "@tabler/icons-react";

import classes from "./NavbarSimple.module.css";
import { NavLink, useNavigate } from "react-router-dom";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { Logout } from "../../../util/loader/Auth";
import NotificationListSmall from "../../notification/NotificationListSmall";

export function NavbarSimple() {
	const [, { open }] = useDisclosure(false);
	const [active, setActive] = useState("home");
	const navigate = useNavigate();
	const isMobile = useMediaQuery(`(max-width: ${em(769)})`);
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
				{localStorage.getItem("role") ? (
					<Menu
						trigger="hover"
						position={!isMobile ? "right-start" : "bottom-end"}
						withArrow
						shadow="md"
					>
						<Menu.Target>
							<a
								onClick={() => {
									navigate("/notifications");
									setActive("notifications");
								}}
								className={classes.link}
								data-active={"notifications" === active || undefined}
							>
								<IconBellRinging className={classes.linkIcon} stroke={1.5} />
								<span>Notifications</span>
							</a>
						</Menu.Target>

						<Menu.Dropdown style={{ height: "400" }}>
							<Group justify="space-between" m="10">
								<Title order={4}>Notifications</Title>
								<NavLink
									onClick={() => setActive("notifications")}
									to="/notifications"
									style={{ textDecoration: "none", color: "#007bff" }}
								>
									See all
								</NavLink>
							</Group>

							<NotificationListSmall />
						</Menu.Dropdown>
					</Menu>
				) : (
					""
				)}
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
			<Container
				m={0}
				p={0}
				display={localStorage.getItem("role") === "ADMIN" ? "block" : "none"}
			>
				<div className={classes.footer}>
					<Text ml="sm">Admin workspace</Text>

					<a
						className={classes.link}
						data-active={"overview" === active || undefined}
						onClick={(event) => {
							event.preventDefault();
							setActive("overview");
							navigate("admin/overview");
						}}
					>
						<IconChartBar className={classes.linkIcon} stroke={1.5} />
						<span>Overview Charts</span>
					</a>
					<a
						data-active={"manage-users" === active || undefined}
						className={classes.link}
						onClick={() => {
							navigate("/admin/manage-user");
							setActive("manage-users");
						}}
					>
						<IconUsers className={classes.linkIcon} stroke={1.5} />
						<span>Manage Users</span>
					</a>
					<a
						data-active={"manage-subject" === active || undefined}
						className={classes.link}
						onClick={() => {
							navigate("/admin/manage-subject");
							setActive("manage-subject");
						}}
					>
						<IconBook className={classes.linkIcon} stroke={1.5} />
						<span>Manage Subjects</span>
					</a>
				</div>
			</Container>
			<Container
				m={0}
				p={0}
				display={
					localStorage.getItem("role") === "STAFF" ||
					localStorage.getItem("role") === "ADMIN"
						? "block"
						: "none"
				}
			>
				<div className={classes.footer}>
					<Text ml="sm">Staff workspace</Text>

					<a
						className={classes.link}
						data-active={"pending-posts" === active || undefined}
						onClick={() => {
							navigate("/staff/manage-post");
							setActive("pending-posts");
						}}
					>
						<IconFileText className={classes.linkIcon} stroke={1.5} />
						<span>Pending posts</span>
					</a>
				</div>
			</Container>
			<div className={classes.footer}>
				<a className={classes.link} onClick={() => Logout()}>
					<IconLogout className={classes.linkIcon} stroke={1.5} />
					<span>Logout</span>
				</a>
			</div>
		</nav>
	);
}
