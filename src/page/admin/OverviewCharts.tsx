import {Badge, Grid} from "@mantine/core";
import {Bar} from "../../component/manageUser/chart/Bar";
import {StatsGrid} from "../../component/manageUser/chart/Statistics";
import {Pie} from "../../component/manageUser/chart/Pie";
import DashboardSectionStaff from "../../component/staff-post/post-manage/DashboardSectionStaff";
import {useState} from "react";
import {ScrollArea} from "@mantine/core";

export default function OverviewCharts() {

    const [flag, setFlag] = useState(false);
    return (
        <>
            <Grid>
                <Grid.Col span={12}>
                    <DashboardSectionStaff flag={flag} setFlag={setFlag}/>
                </Grid.Col>
                <Grid.Col span={12}>
                    <StatsGrid/>
                </Grid.Col>
                <Grid>
                    <Grid.Col span={6}>
                        <Pie/>
                    </Grid.Col>
                    <Grid.Col
                        span={6}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <ScrollArea
                            style={{
                                border: "2px solid rgba(47, 119, 150, 0.7)",
                                borderRadius: "8px",
                                padding: "30px",
                                height: "230px",
                            }}
                        >
                            <h3
                                style={{
                                    textAlign: "center",
                                    fontSize: "0.9rem",
                                }}
                            >
                                This is a Pie Chart about the number between new Mock Tests
                                and new Learning Materials Uploaded in this month
                            </h3>
                            <br/>
                            <div
                                style={{
                                    fontSize: "0.9rem",
                                }}
                            >
                                {" "}
                                Mock Tests : {"   "}
                                <Badge
                                    color="rgba(157, 245, 226, 1)" // Màu sắc của vòng tròn
                                    size="xl" // Kích thước vòng tròn
                                    radius="50%" // Đảm bảo vòng tròn
                                    variant="filled" // Hoặc "outline" nếu muốn đường viền
                                ></Badge>
                            </div>
                            <br/>
                            <div
                                style={{
                                    fontSize: "0.9rem",
                                }}
                            >
                                {" "}
                                Learning Materials :{" "}
                                <Badge
                                    color="rgba(145, 146, 230, 1)" // Màu sắc của vòng tròn
                                    size="xl" // Kích thước vòng tròn
                                    radius="50%" // Đảm bảo vòng tròn
                                    variant="filled" // Hoặc "outline" nếu muốn đường viền
                                ></Badge>
                            </div>
                        </ScrollArea>
                    </Grid.Col>
                </Grid>
                <Grid.Col span={12}>
                    <br/>
                    <br/>
                    <Bar/>
                </Grid.Col>
            </Grid>
        </>
    );
}