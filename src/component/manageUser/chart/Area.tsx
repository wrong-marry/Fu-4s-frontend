import { useEffect, useState } from "react";
import { Box } from "@mantine/core";
import { AreaChart } from "@mantine/charts";

export const Area = () => {
	const [data, setData] = useState<{ date: string; }[]>([]);
    type DataEntry = {
			date: string;
			[subject: string]: number | string; // Adjusting for possible mixed types
		};

	useEffect(() => {
		const fetchData = async () => {
			const token = localStorage.getItem("token");
			const response = await fetch(
				`http://localhost:8080/api/v1/staff/getStatisticAboutPostEachSubject`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			const jsonData = await response.json();

			// Transform the JSON data into the required format
			const transformedData = Object.entries(jsonData).map(
				([date, subjects]) => {
					if (typeof subjects === "object" && subjects !== null) {
						return { date, ...subjects };
					} else {
						return { date };
					}
				}
			);

			setData(transformedData); // Update state with transformed data
		};

		fetchData();
	}, []);

    

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
				Posts per Course Over Time
				<ul>
					{data.map((entry) => (
						<li key={entry.date}>
							{entry.date}:{" "}
							{Object.entries(entry).map(
								([subject, count]) =>
									subject !== "date" && `${subject}: ${count}, `
							)}
						</li>
					))}
				</ul>
			</h1>
			<AreaChart
				h={300}
				data={data}
				dataKey="date"
				series={[
					{ name: "DBI202", color: "indigo.6" },
					{ name: "PRJ301", color: "blue.6" },
					{ name: "PRM392", color: "teal.6" },
					{ name: "ACC101", color: "green.6" },
					{ name: "CEA201", color: "orange.6" },
					{ name: "NWC203c", color: "cyan.6" },
					{ name: "ENW492c", color: "dark.6" },
					{ name: "PMG202c", color: "orange.6" },
					{ name: "SWP391", color: "orange.6" },
					{ name: "SWE201c", color: "orange.6" },
					{ name: "SSL101c", color: "orange.6" },
					{ name: "IOT102", color: "orange.6" },
					{ name: "WED201c", color: "orange.6" },
					{ name: "SWR302", color: "orange.6" },
					{ name: "SWT301", color: "orange.6" },
					{ name: "JPD113", color: "orange.6" },
					{ name: "MLN131", color: "orange.6" },
					{ name: "CSD201", color: "orange.6" },
					{ name: "MAD101", color: "orange.6" },
					{ name: "MLN111", color: "orange.6" },
					{ name: "SEP490", color: "orange.6" },
				]}
				curveType="bump"
			/>
		</Box>
	);
};
