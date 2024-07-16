import { Grid, Tabs, rem } from "@mantine/core";
import {
  IconBook,
  IconChartBar,
  IconUsers,
} from "@tabler/icons-react";
import {Area} from "../../component/manageUser/chart/Area.tsx";
import {Bar} from "../../component/manageUser/chart/Bar.tsx";
import "@mantine/charts/styles.css";
import DashboardSection from "../../component/manageUser/manage-user/show-customer.tsx";
import DashboardSectionStaff from "../../component/staff-post/post-manage/DashboardSectionStaff.tsx";
import {Pie} from "../../component/manageUser/chart/Pie.tsx";
import {StatsGrid} from "../../component/manageUser/chart/Statistics.tsx";
import TableSubject from "../../component/manage-subject/TableSubject.tsx";
import TableUser from "../../component/manageUser/manage-user/TableUser.tsx";
import { useState } from "react";

export default function ManageUserPage() {
  // Sử dụng useMediaQuery để xác định kích thước màn hình

  const iconStyle = {
    width: rem(30),
    height: rem(30),
    color: "rgb(34, 139, 230)", // Set the color of the icons to light blue
  };
  const [flag, setFlag] = useState(false);
  const [flag2, setFlag2] = useState(false);

  return (
		<div>
			<Grid>
				<Tabs
					color="rgba(209, 232, 255, 1)"
					variant="pills"
					orientation="vertical"
					defaultValue="Overview Charts"
					w={"100%"}
				>
					<Grid.Col span={2.6}>
						<Tabs.List style={{ marginTop: "30px" }}>
							<h1
								style={{
									textAlign: "center",
									color: "rgba(2, 104, 207, 1)",
									fontFamily: "Courier New, monospace",
									fontWeight: "bold",
								}}
							>
								WELCOME ADMIN WORKSPACE!
							</h1>
							<Tabs.Tab
								value="Overview Charts"
								leftSection={<IconChartBar style={iconStyle} />}
								style={{ color: "rgb(34, 139, 230)" }}
							>
								Overview Charts
							</Tabs.Tab>
							<Tabs.Tab
								value="Manage Users"
								leftSection={<IconUsers style={iconStyle} />}
								style={{ color: "rgb(34, 139, 230)" }}
							>
								Manage Users
							</Tabs.Tab>
							<Tabs.Tab
								value="Manage Subjects"
								leftSection={<IconBook style={iconStyle} />}
								style={{ color: "rgb(34, 139, 230)" }}
							>
								Manage Subjects
							</Tabs.Tab>
						</Tabs.List>
					</Grid.Col>
					<Grid.Col span={9}>
						<Tabs.Panel value="Overview Charts">
							<Grid>
								<Grid.Col span={12}>
									<DashboardSectionStaff flag={flag} setFlag={setFlag} />
								</Grid.Col>
								<Grid.Col span={12}>
									<StatsGrid />
								</Grid.Col>
								<Grid.Col span={12}>
									<Area />
									<br />
									<StatsGrid />
									<br />
									<Bar />
								</Grid.Col>
								<Grid.Col span={12}>
									<DashboardSectionStaff flag={flag} setFlag={setFlag} />
									<Pie />
								</Grid.Col>
							</Grid>
						</Tabs.Panel>

						<Tabs.Panel value="Manage Users">
							<DashboardSection flag2={flag2} setFlag2={setFlag2} />
							<TableUser flag2={flag2} setFlag2={setFlag2} />
						</Tabs.Panel>

						<Tabs.Panel value="Manage Subjects">
							<TableSubject />
						</Tabs.Panel>
					</Grid.Col>
				</Tabs>
			</Grid>
		</div>
	);
}
