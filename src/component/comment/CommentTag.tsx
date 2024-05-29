import {Avatar, Box, Card, CardSection, Center, Container, Flex, Group, Space, Text} from "@mantine/core"
import {format} from "date-fns";

export default function Comment(props) {
    const username = props.username;
    const content = props.content;
    const time = props.time;
    return (<>
        <Container w={"100%"}>
            <Group m={"md"} align={"flex-start"}>
                <Avatar variant="filled" radius="xl" size="md" mt={"sm"}/>
                <Card p={"sm"} withBorder radius={20}>
                    <CardSection inheritPadding py="md" pb={"xs"}>
                        <Flex>
                            <Text fw={650} lh={"xs"} px={"md"}>{username}</Text>
                            <Space w={"md"}/>
                            <Text fw={200} fz={"sm"}>{format(new Date(time), "dd/MM/yyyy HH:mm")}</Text>
                        </Flex>
                    </CardSection>
                    <CardSection inheritPadding py="md" pt={"xs"}>
                        <Text lh={"xs"} px={"md"}>{content}</Text>
                    </CardSection>
                </Card>
            </Group>
        </Container>
    </>)
}