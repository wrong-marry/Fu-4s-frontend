import { useState } from "react";
import { Grid, Drawer, Burger } from "@mantine/core";
import {NavbarNested } from "../../component/manageUser/navbar-nested/navbar-nested";
import DashboardSection from "../../component/manageUser/manage-user/show-customer";
import TableUser from "../../component/manageUser/manage-user/user-list";
import { useMediaQuery } from "@mantine/hooks";

export default function ManageUser() {
	// Sử dụng useMediaQuery để xác định kích thước màn hình
	const isSmallScreen = useMediaQuery("(max-width: 1100px)");
	const isMediumScreen = useMediaQuery("(max-width: 1024px)");
	const [drawerOpened, setDrawerOpened] = useState(false);

	const handleBurgerClick = () => {
		setDrawerOpened((prev) => !prev);
	};

	return (
		<>
			<Grid>
				<Grid.Col span={isSmallScreen ? 12 : isMediumScreen ? 3 : 2.6}>
					{isSmallScreen ? (
						<Burger opened={drawerOpened} onClick={handleBurgerClick} />
					) : (
						<NavbarNested />
					)}
				</Grid.Col>
				<Grid.Col span={isSmallScreen ? 12 : isMediumScreen ? 9 : 9}>
					<DashboardSection />
					<TableUser />
				</Grid.Col>
			</Grid>

			<Drawer
				opened={drawerOpened}
				onClose={() => setDrawerOpened(false)}
				padding="md"
				size="100%"
			>
				<NavbarNested />
			</Drawer>
		</>
	);
}
