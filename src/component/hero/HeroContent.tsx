import {
	Title,
	Button,
	Text,
	AspectRatio,
	useComputedColorScheme,
	TypographyStylesProvider,
	List,
	ThemeIcon,
	Group,
} from "@mantine/core";
import homepageCover from "../../asset/homepage-cover.jpg";
import landingCover from "../../asset/landing-cover.jpg";
import { useNavigate } from "react-router-dom";
import React from "react";
import { IconCheck } from "@tabler/icons-react";

const teamMembers = [
	{ id: "HE181514", name: "Phan Trung Dũng" },
	{ id: "HE181950", name: "Vũ Minh Hải" },
	{ id: "HE181099", name: "Phạm Thị Kim Thoa" },
	{ id: "HE186179", name: "Nguyễn Thị Như Quỳnh" },
	{ id: "HE180874", name: "Thái Lê Hiếu" },
];

export function HeroContent() {
	const navigate = useNavigate();
	const color = useComputedColorScheme();
	return (
		<AspectRatio
			pos="relative"
			className="w-full h-screen bg-cover "
			style={{ backgroundImage: `url(${homepageCover})` }}
		>
			{color == "dark"}

			<div className="h-full flex justify-start items-center w-[80%] mx-auto">
				<div className="basis-1/2">
					<Title c="black">Welcome to FU-4S!</Title>
					<Text c="black" className="text-left" size="xl" mt="xl">
						FPT University Software Engineering Study Support System - A
						dedicated platform for FPT University students majoring in Software
						Engineering.
					</Text>
					<Text c="black" className="text-left" size="xl">
						Join the community to get your educational journey enhanced with
						valuable resources and interactive discussions!
					</Text>

					<Button
						onClick={() => navigate("/home")}
						variant="gradient"
						size="xl"
						radius="xl"
						className="mt-5"
					>
						Get started
					</Button>
				</div>
			</div>
		</AspectRatio>
	) as React.ReactElement;
}

export function HeroContent2() {
	const navigate = useNavigate();
	const color = useComputedColorScheme();
	return (
		<AspectRatio
			className="w-full h-screen bg-cover "
			style={{ backgroundImage: `url(${landingCover})` }}
			pos="relative"
		>
			{color == "dark"}

			<div className="h-full flex justify-center items-center w-[80%] mx-auto">
				<div className="basis-1/2 ms-2 me-10 mt-20">
					<TypographyStylesProvider>
						<Title c="black">This is a SWP391 project</Title>
						<Text mt="sm">
							We are a dedicated team of students from FPT University, working
							under the guidance of our esteemed instructor, Nguyễn Hoàng Điệp.
						</Text>

						<Title order={2} mt="lg">
							Meet Our Team
						</Title>

						<List
							spacing="sm"
							size="sm"
							center
							icon={
								<ThemeIcon color="teal" size={24} radius="xl">
									<IconCheck size={16} />
								</ThemeIcon>
							}
						>
							{teamMembers.map((member) => (
								<List.Item key={member.id}>
									<Group>
										<Text>
											{member.id} - {member.name}
										</Text>
									</Group>
								</List.Item>
							))}
						</List>
					</TypographyStylesProvider>
					<Button
						color={"orange"}
						onClick={() => navigate("/home")}
						variant="filled"
						size="xl"
						radius="xl"
						className="mt-5 ms-40"
					>
						Explore our website
					</Button>
				</div>
			</div>
		</AspectRatio>
	) as React.ReactElement;
}
