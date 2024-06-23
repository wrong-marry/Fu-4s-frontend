import {
    Avatar,
    Text,
    Button,
    Paper,
    HoverCard,
    Group,
} from "@mantine/core";
import EditIcon from "@mui/icons-material/Edit";
import {ActionToggle} from "../color-scheme/ActionToggle";
import {useNavigate} from "react-router-dom";

export function ProfileCard(props: any) {
    const navigate = useNavigate();
    return (
        <Paper
            className="mx-3 mt-7 sm:mx-16 lg:mx-96"
            radius="md"
            withBorder
            p="lg"
            bg="var(--mantine-color-body)"
        >
            <Avatar
                src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-8.png"
                size={120}
                radius={120}
                mx="auto"
            />
            <Text ta="center" fz="lg" fw={500} mt="md">
                {props.user.username}
            </Text>

            <div className="my-5">
                <Text mx={10} c="dimmed" fz="sm">
                    Email:
                </Text>
                <Group justify="center">
                    <HoverCard width={280} shadow="md">
                        <HoverCard.Target>
                            <Button
                                onClick={() => {
                                    navigate("/update-profile");
                                }}
                                justify="space-between"
                                fullWidth
                                rightSection={<EditIcon/>}
                                variant="default"
                                mt={5}
                            >
                                {props.user.email}
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
                                onClick={() => {
                                    navigate("/update-profile");
                                }}
                                justify="space-between"
                                fullWidth
                                rightSection={<EditIcon/>}
                                variant="default"
                                mt={5}
                            >
                                {props.user.firstName}
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
                                onClick={() => {
                                    navigate("/update-profile");
                                }}
                                justify="space-between"
                                fullWidth
                                rightSection={<EditIcon/>}
                                variant="default"
                                mt={3}
                            >
                                {props.user.lastName}
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
                    gradient={{from: "green", to: "indigo", deg: 90}}
                >
                    Click me to change your password
                </Button>
            </div>

            <ActionToggle/>
        </Paper>
    );
}
