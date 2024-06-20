import {  PieChart } from "@mantine/charts";

const data = [
	{ name: "USA", value: 400, color: "rgba(157, 245, 226, 1)" },
	{ name: "India", value: 300, color: "rgba(145, 146, 230, 1)" },
	{ name: "Japan", value: 300, color: "rgba(186, 230, 145, 1)" },
	{ name: "Other", value: 200, color: "rgba(230, 225, 145, 1)" },
];
export function Pie() {
	return (
		<PieChart
			withLabelsLine
			labelsPosition="outside"
			labelsType="value"
			withLabels
			data={data}
		/>
	);
}
