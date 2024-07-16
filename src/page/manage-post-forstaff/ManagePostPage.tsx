import {Grid, Tabs, rem} from "@mantine/core";
import {IconMessageCircle, IconNotes, IconSettings} from "@tabler/icons-react";
import "@mantine/charts/styles.css";
// import TablePostStaff from "../../component/staff-post/post-manage/TablePostStaff.tsx";
import DashboardSectionStaff from "../../component/staff-post/post-manage/DashboardSectionStaff.tsx";

export default function ManagePostForStaff() {
    // Sử dụng useMediaQuery để xác định kích thước màn hình


    const iconStyle = {
        width: rem(30),
        height: rem(30),
        color: "rgb(34, 139, 230)", // Set the color of the icons to light blue
    };


    return (
        <>
            <Grid>
                <Tabs
                    color="rgba(209, 232, 255, 1)"
                    variant="pills"
                    orientation="vertical"
                    defaultValue="Posts Manage"
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
                                WELCOME STAFF WORKSPACE!
                            </h1>
                            <Tabs.Tab
                                value="Posts Manage"
                                leftSection={<IconNotes style={iconStyle}/>}
                                style={{color: "rgb(34, 139, 230)"}}
                            >
                                Posts Manage
                            </Tabs.Tab>
                            <Tabs.Tab
                                value="Comments Manage"
                                leftSection={<IconMessageCircle style={iconStyle}/>}
                                style={{color: "rgb(34, 139, 230)"}}
                            >
                                Comments Manage
                            </Tabs.Tab>
                            <Tabs.Tab
                                value="settings"
                                leftSection={<IconSettings style={iconStyle}/>}
                                style={{color: "rgb(34, 139, 230)"}}
                            >
                                Settings
                            </Tabs.Tab>
                        </Tabs.List>
                    </Grid.Col>
                    <Grid.Col span={9}>
                        <Tabs.Panel value="Posts Manage">
                            <DashboardSectionStaff/>
                            {/*<TablePostStaff />*/}
                        </Tabs.Panel>

                        <Tabs.Panel value="Comments Manage">dgugf</Tabs.Panel>

                        <Tabs.Panel value="settings">Settings tab content</Tabs.Panel>
                    </Grid.Col>
                </Tabs>
            </Grid>
        </>
    );
}
