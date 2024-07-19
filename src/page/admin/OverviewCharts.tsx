import { Grid } from "@mantine/core";
import { Bar } from "../../component/manageUser/chart/Bar";
import { StatsGrid } from "../../component/manageUser/chart/Statistics";
import { Area } from "../../component/manageUser/chart/Area";
import { Pie } from "../../component/manageUser/chart/Pie";
import DashboardSectionStaff from "../../component/staff-post/post-manage/DashboardSectionStaff";
import { useState } from "react";

export default function OverviewCharts(){
    
  const [flag, setFlag] = useState(false);
    return(<>
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
							</Grid></>);
}