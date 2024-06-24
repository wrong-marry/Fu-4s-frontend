import React, { useState, useEffect } from "react";
import {
	Text,
	Button,
	Paper,
	HoverCard,
	Group,
	Modal,
	Avatar as MantineAvatar,
} from "@mantine/core";
import EditIcon from "@mui/icons-material/Edit";
import { ActionToggle } from "../color-scheme/ActionToggle";
import { useNavigate } from "react-router-dom";
import Avatar from "react-avatar-edit";

interface User {
	username: string;
	email: string;
	firstName: string;
	lastName: string;
}

interface ProfileCardProps {
	user: User;
}

export function ProfileCard({ user }: ProfileCardProps) {
	const navigate = useNavigate();
	const [preview, setPreview] = useState<string>(
		"https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-11.png"
	);

	const [avatarUrl, setAvatarUrl] = useState<string>(
		"https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-11.png"
	);
	const [src, setSrc] = useState<string>(avatarUrl);
	const [modalOpen, setModalOpen] = useState<boolean>(false);

	useEffect(() => {
		const username = localStorage.getItem("username");
		if (username) {
			const url = `http://localhost:8080/api/v1/user/getAvatar?username=${username}`;
			setAvatarUrl(url);
			setSrc(url);
		}
	}, []);

	const onClose = () => {};

	const onCrop = (preview: string) => {
		setPreview(preview);
	};
	const handleFileChange = () => {
		if (!preview) return;

		fetch(preview)
			.then((res) => res.blob())
			.then((blob) => {
				const file = new File([blob], "avatar.png", { type: "image/png" });

				const formData = new FormData();
				formData.append("image", file);
				const username = localStorage.getItem("username");
				if (username) {
					formData.append("username", username);
				}

				fetch("http://localhost:8080/api/v1/user/avatar", {
					method: "POST",
					body: formData,
				})
					.then((response) => response.json())
					.then(() => {
						if (username) {
							const url = `http://localhost:8080/api/v1/user/getAvatar?username=${username}`;
							setAvatarUrl(url);
							setSrc(url);
						}
					})
					.catch((error) => console.error("Error uploading image:", error));
			});
		setModalOpen(false);
	};

	return (
		<Paper
			className="mx-3 mt-7 sm:mx-16 lg:mx-96"
			radius="md"
			withBorder
			p="lg"
			bg="var(--mantine-color-body)"
		>
			<HoverCard>
				<HoverCard.Target>
					<MantineAvatar
						src={avatarUrl}
						size={120}
						radius={120}
						mx="auto"
						style={{
							backgroundColor: "black",
							opacity: 1,
							"&:hover": {
								opacity: 0.5,
								cursor: "pointer",
							},
						}}
						onClick={() => {
							setModalOpen(true);
							setAvatarUrl(preview);
						}}
					/>
				</HoverCard.Target>
				<HoverCard.Dropdown>
					<Text size="sm">Click me to edit</Text>
				</HoverCard.Dropdown>
			</HoverCard>

			<Modal
				opened={modalOpen}
				onClose={() => setModalOpen(false)}
				size="lg"
				title="Crop your new avatar"
			>
				<div
					style={{
						display: "flex",
						justifyContent: "center",
						marginBottom: "20px",
					}}
				>
					<Avatar
						width={390}
						height={295}
						onCrop={onCrop}
						onClose={onClose}
						src={src}
					/>
				</div>

				<div
					style={{
						display: "flex",
						justifyContent: "flex-end",
						marginTop: "20px",
					}}
				>
					<Button onClick={handleFileChange}>Save</Button>
				</div>
			</Modal>

			<Text ta="center" fz="lg" fw={500} mt="md">
				{user.username}
			</Text>
			<div className="my-5">
				<Text mx={10} c="dimmed" fz="sm">
					Email:
				</Text>
				<Group justify="center">
					<HoverCard width={280} shadow="md">
						<HoverCard.Target>
							<Button
								onClick={() => navigate("/update-profile")}
								justify="space-between"
								fullWidth
								rightSection={<EditIcon />}
								variant="default"
								mt={5}
							>
								{user.email}
							</Button>
						</HoverCard.Target>
						<HoverCard.Dropdown>
							<Text size="sm">Click me to edit your profile</Text>
						</HoverCard.Dropdown>
					</HoverCard>
				</Group>
			</div>
			<div className="my-5">
				<Text mx={10} c="dimmed" fz="sm">
					First name:
				</Text>
				<Group justify="center">
					<HoverCard width={280} shadow="md">
						<HoverCard.Target>
							<Button
								onClick={() => navigate("/update-profile")}
								justify="space-between"
								fullWidth
								rightSection={<EditIcon />}
								variant="default"
								mt={5}
							>
								{user.firstName}
							</Button>
						</HoverCard.Target>
						<HoverCard.Dropdown>
							<Text size="sm">Click me to edit your profile</Text>
						</HoverCard.Dropdown>
					</HoverCard>
				</Group>
			</div>
			<div className="my-5 mb-8">
				<Text mx={10} c="dimmed" fz="sm">
					Last name:
				</Text>
				<Group justify="center">
					<HoverCard width={280} shadow="md">
						<HoverCard.Target>
							<Button
								onClick={() => navigate("/update-profile")}
								justify="space-between"
								fullWidth
								rightSection={<EditIcon />}
								variant="default"
								mt={3}
							>
								{user.lastName}
							</Button>
						</HoverCard.Target>
						<HoverCard.Dropdown>
							<Text size="sm">Click me to edit your profile</Text>
						</HoverCard.Dropdown>
					</HoverCard>
				</Group>
			</div>
			<div className="flex justify-center my-5">
				<Button
					onClick={() => navigate("/change-password")}
					variant="gradient"
					gradient={{ from: "green", to: "indigo", deg: 90 }}
				>
					Click me to change your password
				</Button>
			</div>
			<ActionToggle />
		</Paper>
	);
}
