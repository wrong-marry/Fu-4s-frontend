import { AreaChart } from "@mantine/charts";
import { Box } from "@mantine/core";

const data = [
	{
		date: getCurrentDate(),
		Staffs: 2890,
		Admin: 2338,
		Users: 2452,
	},
	{
		date: "Mar 23",
		Staffs: 2756,
		Admin: 2103,
		Users: 2402,
	},
	{
		date: "Mar 24",
		Staffs: 3322,
		Admin: 986,
		Users: 1821,
	},
	{
		date: "Mar 25",
		Staffs: 3470,
		Admin: 2108,
		Users: 2809,
	},
];
function getCurrentDate() {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  return `${day}/${month}/${year}`;
}

export function Area() {
   
	return (
		<Box>
			<h1
				style={{
					textAlign: "center",
					color: "rgba(2, 104, 207, 1)",
					fontFamily: "Courier New, monospace",
					fontWeight: "bold",
					padding: "20px",
				}}
			>
				Stacked area chart
			</h1>
			<AreaChart
				h={300}
				data={data}
				dataKey="date"
				series={[
					{ name: "Staffs", color: "indigo.6" },
					{ name: "Admin", color: "blue.6" },
					{ name: "Users", color: "teal.6" },
				]}
				curveType="bump"
			/>
		</Box>
	);
}
