import {Grid, Tabs} from "@mantine/core";
import "@mantine/charts/styles.css";
import DashboardSectionStaff from "../../component/staff-post/post-manage/DashboardSectionStaff.tsx";
import PostPage1 from "../../component/staff-post/post-manage/PendingPost.tsx";
import { useState } from "react";
import TablePostStaff from "../../component/staff-post/post-manage/TablePostStaff.tsx";
import { ScrollArea } from "@mantine/core";


export default function ManagePostForStaff() {
  
	 const [flag, setFlag] = useState(false);

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
					<Grid.Col span={10} offset={1}>
						<Tabs.Panel value="Posts Manage">
							<DashboardSectionStaff flag={flag} setFlag={setFlag} />
							<br />
							<br />
							<ScrollArea
								h={500}
								style={{
									border: "2px solid rgba(47, 119, 150, 0.7)",
									borderRadius: "8px",
									padding: "10px",
								}}
							>
								{<PostPage1 flag={flag} setFlag={setFlag} />}
							</ScrollArea>

							<br />
							<TablePostStaff flag={flag} setFlag={setFlag} />
						</Tabs.Panel>
					</Grid.Col>
				</Tabs>
			</Grid>
		</>
	);
}
