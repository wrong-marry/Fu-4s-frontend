import { Group, Paper, SimpleGrid, Text } from "@mantine/core";
import {
	IconUserPlus,
	IconDiscount2,
	IconReceipt2,
	IconCoin,
	IconArrowUpRight,
	IconArrowDownRight,
	Icon24Hours,
} from "@tabler/icons-react";
import classes from "./StatsGrid.module.css";
import { useEffect, useState } from "react";
import { BASE_URL } from "../../../common/constant";

const dataTemplate = [
	{ title: "Web users", icon: IconUserPlus, value: 0, diff: 0 },
	{ title: "Number of posts", icon: Icon24Hours, value: 0, diff: 0 },
	{ title: "Learning materials", icon: IconCoin, value: 0, diff: 0 },
	{ title: "Mock tests", icon: IconUserPlus, value: 0, diff: 0 },
	{
		title: "Total test participation",
		icon: IconReceipt2,
		value: 0,
		diff: 0,
	},
	{ title: "Level of interaction", icon: IconDiscount2, value: 0, diff: 0 },
];

export function StatsGrid() {
	const [data1, setData1] = useState(dataTemplate);
	const pageSize = 3;

	useEffect(() => {
		const fetchNumOfUser = async () => {
			const token = localStorage.getItem("token");
			try {
				const response = await fetch(`${BASE_URL}/api/v1/admin/getNumUser`, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});
				const responsePercent = await fetch(
					`${BASE_URL}/api/v1/admin/compareNumberAccounts`,
					{
						headers: {
							Authorization: `Bearer ${token}`,
						},
					}
				);
				const responseNumberPost = await fetch(
					`${BASE_URL}/api/v1/post/getAllPost?pageSize=${pageSize}`,
					{
						headers: {
							Authorization: `Bearer ${token}`,
						},
					}
				);
				const responsePercentPost = await fetch(
					`${BASE_URL}/api/v1/staff/compareNumberPosts`,
					{
						headers: {
							Authorization: `Bearer ${token}`,
						},
					}
				);
				const responseNumberTests = await fetch(
					`${BASE_URL}/api/v1/search?pageSize=${pageSize}`,
					{
						headers: {
							Authorization: `Bearer ${token}`,
						},
					}
				);
				const responseNumberNewTests = await fetch(
					`${BASE_URL}/api/v1/staff/numberTestsNew`,
					{
						headers: {
							Authorization: `Bearer ${token}`,
						},
					}
				);
				const responseNumberNewMaterials = await fetch(
					`${BASE_URL}/api/v1/staff/numberMaterialsNew`,
					{
						headers: {
							Authorization: `Bearer ${token}`,
						},
					}
				);
				const responseNumberComments = await fetch(
					`${BASE_URL}/api/v1/admin/getNumComments`,
					{
						headers: {
							Authorization: `Bearer ${token}`,
						},
					}
				);
				const responseNumberTestResults = await fetch(
					`${BASE_URL}/api/v1/admin/getNumTestResults`,
					{
						headers: {
							Authorization: `Bearer ${token}`,
						},
					}
				);
				const responsePercentComment = await fetch(
					`${BASE_URL}/api/v1/admin/percentCommentsNew`,
					{
						headers: {
							Authorization: `Bearer ${token}`,
						},
					}
				);
				const responsePercentTestResult = await fetch(
					`${BASE_URL}/api/v1/admin/percentTestResultsNew`,
					{
						headers: {
							Authorization: `Bearer ${token}`,
						},
					}
				);

				const userData = await response.json();
				const percent = await responsePercent.json();
				const percentPost = await responsePercentPost.json();
				const percentComment = await responsePercentComment.json();
				const percentTestResult = await responsePercentTestResult.json();
				const numberPost = await responseNumberPost.json();
				const numberTests = await responseNumberTests.json();
				const newTests = await responseNumberNewTests.json();
				const newMaterials = await responseNumberNewMaterials.json();
				const numberComments = await responseNumberComments.json();
				const numberTestResults = await responseNumberTestResults.json();
				setData1((prevData) => {
					return prevData.map((stat) => {
						if (stat.title === "Web users") {
							return { ...stat, value: userData, diff: percent };
						}
						if (stat.title === "Number of posts") {
							return { ...stat, value: numberPost.total, diff: percentPost };
						}
						if (stat.title === "Learning materials") {
							return {
								...stat,
								value: numberTests.data.totalMaterial,
								diff: parseFloat(
									(
										(newMaterials * (1 / 100)) /
										numberTests.data.totalMaterial
									).toFixed(3)
								),
							};
						}
						if (stat.title === "Mock tests") {
							return {
								...stat,
								value: numberTests.data.totalTest,
								diff: parseFloat(
									((newTests * (1 / 100)) / numberTests.data.totalTest).toFixed(
										3
									)
								),
							};
						}
						if (stat.title === "Total test participation") {
							return {
								...stat,
								value: numberTestResults,
								diff: percentTestResult,
							};
						}
						if (stat.title === "Level of interaction") {
							return {
								...stat,
								value: numberComments,
								diff: percentComment,
							};
						}

						return stat;
					});
				});
			} catch (error) {
				console.error("Error fetching number of users:", error);
			}
		};
		fetchNumOfUser();
	}, []);

	const stats = data1.map((stat) => {
		const Icon = stat.icon;
		const DiffIcon = stat.diff > 0 ? IconArrowUpRight : IconArrowDownRight;

		return (
			<Paper withBorder p="md" radius="md" key={stat.title}>
				<Group justify="space-between">
					<Text size="xs" c="dimmed" className={classes.title}>
						{stat.title}
					</Text>
					<Icon className={classes.icon} size="1.4rem" stroke={1.5} />
				</Group>

				<Group align="flex-end" gap="xs" mt={25}>
					<Text className={classes.value}>{stat.value}</Text>
					<Text
						c={stat.diff > 0 ? "teal" : "red"}
						fz="sm"
						fw={500}
						className={classes.diff}
					>
						<span>{stat.diff}%</span>
						<DiffIcon size="1rem" stroke={1.5} />
					</Text>
				</Group>

				<Text fz="xs" c="dimmed" mt={7}>
					Compared to previous month
				</Text>
			</Paper>
		);
	});

	return (
		<div className={classes.root}>
			<SimpleGrid cols={{ base: 1, xs: 2, md: 3 }}>{stats}</SimpleGrid>
		</div>
	);
}
