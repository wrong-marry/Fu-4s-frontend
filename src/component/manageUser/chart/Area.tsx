import  { useEffect, useState } from "react";
import { Box } from "@mantine/core";
import { AreaChart } from "@mantine/charts";

const dataTemplate = [
	{
		date: "2023-12",
        "DBI202": 0,
        "PRJ301": 0,
        "PRM392": 0,
        "ACC101": 0,
        "CEA201": 0,
        "NWC203c": 0,
        "ENW492c": 0,
        "PMG202c": 0,
        "SWP391": 0,
        "SWE201c": 0,
        "SSL101c": 0,
        "IOT102": 0,
        "WED201c": 0,
        "SWR302": 0,
        "SWT301": 0,
        "JPD113": 0,
        "MLN131": 0,
        "CSD201": 0,
        "MAD101": 0,
        "MLN111": 0,
        "SEP490": 0,
        "PRF192": 0,
        "LAB211": 0,
        "SWD392": 0,
        "SE-0002": 0,
        "ITE302c": 0,
        "SE-0003": 0,
        "VNR202": 0,
        "OSG202": 0,
        "HCM202": 0,
        "OJT202": 0,
        "CSI104": 0,
        "MAS291": 0,
        "SAP341": 0,
        "EXE101": 0,
        "PRO192": 0,
        "EXE201": 0,
        "MAE101": 0,
        "JPD123": 0,
        "MLN122": 0,
        "SSG104": 0,
        "WDU203c": 0,
    },   

    ];

export const Area = () => {
	const [data, setData] = useState([]);

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
			setData(jsonData); // Cập nhật state với dữ liệu nhận được
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
					{Object.entries(data).map(
						(
							[subject, stats] // Sử dụng dữ liệu từ state
						) => (
							<li key={subject}>
								{subject}:{" "}
								{Object.entries(stats).map(
									([month, count]) => `${month}: ${count}, `
								)}
							</li>
						)
					)}
				</ul>
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
};
