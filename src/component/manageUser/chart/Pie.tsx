import React, { useEffect, useState } from "react";
import { Group, Text } from "@mantine/core";
import { PieChart } from "@mantine/charts";
import { BASE_URL } from "../../../common/constant";

interface ChartData {
	name: string;
	value: number;
	color: string;
}

const fetchData = async (): Promise<ChartData[]> => {
	const token = localStorage.getItem("token");
	if (!token) {
		throw new Error("Token not found");
	}

	const responseNumberNewTests = await fetch(
		`${BASE_URL}/api/v1/staff/numberTestsNew`,
		{
			headers: {
				Authorization: `Bearer ${token}`,
			},
		}
	);
	if (!responseNumberNewTests.ok) {
		throw new Error("Failed to fetch number of new tests");
	}

	const responseNumberNewMaterials = await fetch(
		`${BASE_URL}/api/v1/staff/numberMaterialsNew`,
		{
			headers: {
				Authorization: `Bearer ${token}`,
			},
		}
	);
	if (!responseNumberNewMaterials.ok) {
		throw new Error("Failed to fetch number of new materials");
	}

	const mockTestData = await responseNumberNewTests.json();
	const learningMaterialData = await responseNumberNewMaterials.json();

	return [
		{
			name: "Mock Tests",
			value: mockTestData,
			color: "rgba(157, 245, 226, 1)",
		},
		{
			name: "Learning Materials",
			value: learningMaterialData,
			color: "rgba(145, 146, 230, 1)",
		},
	];
};

export function Pie() {
	const [data, setData] = useState<ChartData[]>([]);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const getData = async () => {
			try {
				const apiData = await fetchData();
				setData(apiData);
			} catch (err: unknown) {
				if (err instanceof Error) {
					setError(err.message);
				} else {
					setError("An unknown error occurred");
				}
			}
		};

		getData();
	}, []);

	if (error) {
		return <div>Error: {error}</div>;
	}

	return (
		<div>
			<Text fz="lg" mb="md" ta="center" fw="bold">
				Number of new tests and learning materials
			</Text>
			<PieChart
				withTooltip
				mx="auto"
				withLabelsLine
				labelsPosition="outside"
				labelsType="value"
				withLabels
				data={data}
				size={320}
			/>
		</div>
	);
}
