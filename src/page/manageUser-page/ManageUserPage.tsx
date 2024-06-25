import {Grid, Tabs, rem} from "@mantine/core";
import {
    IconBook,
    IconChartBar,
    IconEyeCheck,
    IconFileText,
    IconMessage,
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
import TablePostStaff from "../../component/staff-post/post-manage/TablePostStaff.tsx";
import TableUser from "../../component/manageUser/manage-user/TableUser.tsx";

export default function ManagePostForStaff() {
    // Sử dụng useMediaQuery để xác định kích thước màn hình

    const iconStyle = {
        width: rem(30),
        height: rem(30),
        color: "rgb(34, 139, 230)", // Set the color of the icons to light blue
    };

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
                        <Tabs.List style={{marginTop: "30px"}}>
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
                                leftSection={<IconChartBar style={iconStyle}/>}
                                style={{color: "rgb(34, 139, 230)"}}
                            >
                                Overview Charts
                            </Tabs.Tab>
                            <Tabs.Tab
                                value="Manage Users"
                                leftSection={<IconUsers style={iconStyle}/>}
                                style={{color: "rgb(34, 139, 230)"}}
                            >
                                Manage Users
                            </Tabs.Tab>
                            <Tabs.Tab
                                value="Manage Subjects"
                                leftSection={<IconBook style={iconStyle}/>}
                                style={{color: "rgb(34, 139, 230)"}}
                            >
                                Manage Subjects
                            </Tabs.Tab>
                            <Tabs.Tab
                                value="Staff Monitoring"
                                leftSection={<IconEyeCheck style={iconStyle}/>}
                                style={{color: "rgb(34, 139, 230)"}}
                            >
                                Staff Monitoring
                            </Tabs.Tab>
                            <Tabs.Tab
                                value="Pending Posts"
                                leftSection={<IconFileText style={iconStyle}/>}
                                style={{color: "rgb(34, 139, 230)"}}
                            >
                                Pending Posts
                            </Tabs.Tab>
                            <Tabs.Tab
                                value="Pending Comments"
                                leftSection={<IconMessage style={iconStyle}/>}
                                style={{color: "rgb(34, 139, 230)"}}
                            >
                                Pending Comments
                            </Tabs.Tab>
                        </Tabs.List>
                    </Grid.Col>
                    <Grid.Col span={9}>
                        <Tabs.Panel value="Overview Charts">
                            <Grid>
                                <Grid.Col span={12}>
                                    <DashboardSection/>
                                    <StatsGrid/>
                                </Grid.Col>
                                <Grid.Col span={6}>
                                    <Bar/>
                                    <Area/>
                                </Grid.Col>
                                <Grid.Col span={12}>
                                    <DashboardSectionStaff/>
                                    <Pie/>
                                </Grid.Col>
                            </Grid>
                        </Tabs.Panel>

                        <Tabs.Panel value="Manage Users">
                            <DashboardSection/>
                            <TableUser/>
                        </Tabs.Panel>

                        <Tabs.Panel value="Manage Subjects">
                            <TableSubject/>
                        </Tabs.Panel>
                        <Tabs.Panel value="Staff Monitoring">
                            Settings tab content
                        </Tabs.Panel>
                        <Tabs.Panel value="Pending Posts">
                            <DashboardSectionStaff/>
                            <TablePostStaff/>
                        </Tabs.Panel>
                        <Tabs.Panel value="Pending Comments">
                            Settings tab content
                        </Tabs.Panel>
                        <Tabs.Panel value="settings">Settings tab content</Tabs.Panel>
                    </Grid.Col>
                </Tabs>
            </Grid>
        </div>
    );
}
