import {
	Button,
	Menu,
	rem,
	Avatar,
	Group,
	Text,
	useMantineColorScheme,
	useComputedColorScheme,
} from "@mantine/core";
import logo from "../../asset/logo.png";
import darkLogo from "../../asset/darkLogo.png";
import { NavLink, useLoaderData, useNavigate } from "react-router-dom";
import {
	IconPhoto,
	IconLibraryPlus,
	IconSquarePlus,
	IconSettings,
	IconUserCircle,
	IconPremiumRights,
	IconLogout,
	IconDeviceLaptop,
} from "@tabler/icons-react";

import { DarkModeSwitch } from "react-toggle-dark-mode";
import React, { useContext, useEffect } from "react";
import {
	UserCredentials,
	UserCredentialsContext,
} from "../../store/user-credentials-context";
import { useDisclosure } from "@mantine/hooks";
import GeneralSearchBar from "./search/GeneralSearchBar.tsx";

import { Logout } from "../../util/loader/Auth.tsx";

import NotificationCard from "../notification/NotificationCard.tsx";

const userBtn = (data: LoaderData, handleLogout: () => void) => {
	return (
		<>
			<Menu shadow="md" width={200}>
				<Menu.Target>
					<Group className="cursor-pointer border-none">
						<Avatar
							variant="filled"
							radius="xl"
							color="grape"
							className="cursor-pointer"
							// src={data?.avatar}
						/>
						<Text className="text-sm font-semibold">
							{data ? data.firstName + " " + data.lastName : "Guest"}
						</Text>
					</Group>
				</Menu.Target>

				<Menu.Dropdown>
					<Menu.Label>Menu</Menu.Label>
					<NavLink to={"/user"}>
						<Menu.Item
							leftSection={
								<IconUserCircle style={{ width: rem(14), height: rem(14) }} />
							}
						>
							Profile
						</Menu.Item>
					</NavLink>

					<NavLink to={"/user/post"}>
						<Menu.Item
							leftSection={
								<IconSettings style={{ width: rem(14), height: rem(14) }} />
							}
						>
							Manage Posts
						</Menu.Item>
					</NavLink>

					<NavLink to={"/test-result"}>
						<Menu.Item
							leftSection={
								<IconPremiumRights
									style={{ width: rem(14), height: rem(14) }}
								/>
							}
						>
							Test History
						</Menu.Item>
					</NavLink>

					<Menu.Divider />
					<Menu.Item
						color="red"
						leftSection={
							<IconLogout style={{ width: rem(14), height: rem(14) }} />
						}
						onClick={handleLogout}
					>
						Logout
					</Menu.Item>
				</Menu.Dropdown>
			</Menu>
		</>
	) as React.ReactElement;
};

const adminBtn = (data: LoaderData, handleLogout: () => void) => {
	return (
		<>
			<Menu shadow="md" width={200}>
				<Menu.Target>
					<Group className="cursor-pointer border-none">
						<Avatar
							variant="filled"
							radius="xl"
							color="grape"
							className="cursor-pointer"
							// src={data?.avatar}
						/>
						<Text className="text-sm font-semibold">
							{data ? data.firstName + " " + data.lastName : "Guest"}
						</Text>
					</Group>
				</Menu.Target>
				<Menu.Dropdown>
					<Menu.Label>Menu</Menu.Label>
					<NavLink to={"/user"}>
						<Menu.Item
							leftSection={
								<IconUserCircle style={{ width: rem(14), height: rem(14) }} />
							}
						>
							Profile
						</Menu.Item>
					</NavLink>

					<NavLink to={"/user/post"}>
						<Menu.Item
							leftSection={
								<IconSettings style={{ width: rem(14), height: rem(14) }} />
							}
						>
							Manage Posts
						</Menu.Item>
					</NavLink>
					<NavLink to={"/test-result"}>
						<Menu.Item
							leftSection={
								<IconPremiumRights
									style={{ width: rem(14), height: rem(14) }}
								/>
							}
						>
							Test History
						</Menu.Item>
					</NavLink>
					<Menu.Divider />
					<Menu.Item
						color="red"
						leftSection={
							<IconLogout style={{ width: rem(14), height: rem(14) }} />
						}
						onClick={handleLogout}
					>
						Logout
					</Menu.Item>
				</Menu.Dropdown>
			</Menu>
			<Menu shadow="md" width={200}>
				<Menu.Target>
					<IconDeviceLaptop className="cursor-pointer w-5 h-5" />
				</Menu.Target>
				<Menu.Dropdown>
					<Menu.Label>Admin Menu</Menu.Label>
					<NavLink to={"/admin/manage-user"}>
						<Menu.Item
							leftSection={
								<IconDeviceLaptop style={{ width: rem(14), height: rem(14) }} />
							}
						>
							Join your workspace
						</Menu.Item>
					</NavLink>
				</Menu.Dropdown>
			</Menu>
		</>
	) as React.ReactElement;
};
const staffBtn = (data: LoaderData, handleLogout: () => void) => {
	return (
		<>
			<Menu shadow="md" width={200}>
				<Menu.Target>
					<Group className="cursor-pointer border-none">
						<Avatar
							variant="filled"
							radius="xl"
							color="grape"
							className="cursor-pointer"
							// src={data?.avatar}
						/>
						<Text className="text-sm font-semibold">
							{data ? data.firstName + " " + data.lastName : "Guest"}
						</Text>
					</Group>
				</Menu.Target>
				<Menu.Dropdown>
					<Menu.Label>Menu</Menu.Label>
					<NavLink to={"/user"}>
						<Menu.Item
							leftSection={
								<IconUserCircle style={{ width: rem(14), height: rem(14) }} />
							}
						>
							Profile
						</Menu.Item>
					</NavLink>

					<NavLink to={"/user/post"}>
						<Menu.Item
							leftSection={
								<IconSettings style={{ width: rem(14), height: rem(14) }} />
							}
						>
							Manage Posts
						</Menu.Item>
					</NavLink>

					<Menu.Item
						leftSection={
							<IconPremiumRights style={{ width: rem(14), height: rem(14) }} />
						}
					>
						Upgrade to Premium
					</Menu.Item>

					<Menu.Divider />
					<Menu.Item
						color="red"
						leftSection={
							<IconLogout style={{ width: rem(14), height: rem(14) }} />
						}
						onClick={handleLogout}
					>
						Logout
					</Menu.Item>
				</Menu.Dropdown>
			</Menu>
			<Menu shadow="md" width={200}>
				<Menu.Target>
					<IconDeviceLaptop className="cursor-pointer w-5 h-5" />
				</Menu.Target>
				<Menu.Dropdown>
					<Menu.Label>Staff Menu</Menu.Label>
					<NavLink to={"/staff/manage-post"}>
						<Menu.Item
							leftSection={
								<IconDeviceLaptop style={{ width: rem(14), height: rem(14) }} />
							}
						>
							Join your workspace
						</Menu.Item>
					</NavLink>
				</Menu.Dropdown>
			</Menu>
		</>
	) as React.ReactElement;
};

const guestBtn = () => {
	const navigate = useNavigate();
	return (
		<>
			<Button
				onClick={() => navigate("/auth")}
				variant={"light"}
				color="indigo"
				radius="md"
				fz="sm"
			>
				Login
			</Button>

			<Button
				onClick={() => navigate("/auth/register")}
				variant="filled"
				color="indigo"
				radius="md"
				fz="sm"
			>
				Signup
			</Button>
		</>
	);
};

export interface LoaderData {
	error?: boolean;
	username?: string;
	firstName?: string;
	lastName?: string;
	email: string;
	role: string;
    status: string;
}

function Navbar() {
	const [, { open }] = useDisclosure(false);

	const { assignUserCredentials } = useContext(UserCredentialsContext);
	const data: LoaderData = useLoaderData() as LoaderData;
	useEffect(() => {
		if (data !== null) {
			assignUserCredentials({
				...data,
			} as unknown as UserCredentials);
		}
	}, [data]);

	// useEffect(() => {
	//   if (data?.banned) {
	//     submit(null, { method: "post", action: "/logout" });
	//     toast.error("Your account has been banned");
	//   }
	// }, [data]);
	const { colorScheme, setColorScheme } = useMantineColorScheme({
		keepTransitions: true,
	});
	const computedColorScheme = useComputedColorScheme("light");
	const toggleColorScheme = () => {
		setColorScheme(computedColorScheme === "dark" ? "light" : "dark");
	};

	const btnState =
		data?.error || !data
			? guestBtn()
			: data.role === "ADMIN"
			? adminBtn(data, Logout)
			: data.role === "STAFF"
			? staffBtn(data, Logout)
			: userBtn(data, Logout);

	const whichHomepage = "";

	return (
		<>
			<header className="w-full h-16 flex items-center justify-between sticky top-0 z-20 shadow-sm bg-[--mantine-color-body]">
				<div className="flex items-center w-full">
					<NavLink to={whichHomepage} className="w-32 mx-5">
						<img
							src={computedColorScheme === "dark" ? darkLogo : logo}
							alt="Dark FU4S logo"
						/>
					</NavLink>

					<div className="ml-5 flex items-center">
						<NavLink to="/home" className="no-underline">
							{({ isActive }) => (
								<Button
									autoContrast
									color="indigo"
									variant={isActive ? "light" : "subtle"}
								>
									Home
								</Button>
							)}
						</NavLink>
						<NavLink to="/study" className="no-underline">
							{({ isActive }) => (
								<Button
									autoContrast
									color="indigo"
									variant={isActive ? "light" : "subtle"}
								>
									Study
								</Button>
							)}
						</NavLink>
					</div>

					<div className="ml-5 grow">
						<GeneralSearchBar />
					</div>

					<Group className="mx-5">
						<DarkModeSwitch
							checked={colorScheme === "dark"}
							onChange={toggleColorScheme}
							size={20}
						/>
						<Menu trigger="hover" shadow="md" width={200}>
							<Menu.Target>
								<IconSquarePlus className="w-5 h-auto" />
							</Menu.Target>

							<Menu.Dropdown>
								<Menu.Label>Create</Menu.Label>
								<NavLink to={"/create-mock-test"}>
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

								<NavLink to={"/create-learning-material"}>
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

						{data &&
							(data.role === "ADMIN" ||
								data.role === "STAFF" ||
								data.role === "USER") && <NotificationCard />}
						<Group>{btnState}</Group>
					</Group>
				</div>
			</header>
		</>
	);
}

export default Navbar;
