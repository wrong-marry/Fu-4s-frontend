import {Anchor, Avatar, Box, Card, CardSection, Center, Container, Flex, Group, Space, Stack, Text} from "@mantine/core"
import {format} from "date-fns";
import axios, {HttpStatusCode} from "axios";
import {useState} from "react";

export default function Comment(props) {
    const username = props.username;
    const content = props.content;
    const time = props.time;
    const isMine: boolean = props.isMine;
    const id = props.id;

    const [contentStack, setContentStack] = useState(
        <Stack gap={3}>
            <Card p={"sm"} withBorder radius={20}>
                <CardSection inheritPadding py="md" pb={"xs"}>
                    <Flex>
                        <Text fw={650} lh={"xs"} px={"md"}>{username}</Text>
                        <Space w={"md"}/>
                        <Text px={"md"} fw={200} fz={"sm"}>{format(new Date(time), "dd/MM/yyyy HH:mm")}</Text>
                    </Flex>
                </CardSection>
                <CardSection inheritPadding py="md" pt={"xs"}>
                    <Text lh={"xs"} px={"md"}>{content}</Text>
                </CardSection>
            </Card>
            <Group mt={0} mx={"md"} lh={"xs"}>
                <Anchor fz={"sm"} mx={"sm"} mt={0}>Love</Anchor>
                {isMine ?
                    <>
                        <Anchor fz={"sm"} mt={0} mx={"sm"}>Update</Anchor>
                        <Anchor fz={"sm"} mt={0} mx={"sm"} onClick={() => deleteComment(id)}>Delete</Anchor>
                    </> : <Anchor fz={"sm"} mx={"sm"}>Reply</Anchor>}
            </Group>
        </Stack>
    );

    const deleteComment = async (id: number) => {
        try {
            const response = await axios.delete(
                "http://localhost:8080/api/v1/comments/" + id,
                {
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem("token")
                    }
                });
            if (response.status == 200) {
                setContentStack(
                    <Card p={"sm"} withBorder radius={20}>
                        <CardSection inheritPadding py="md" pb={"xs"}>
                            <Flex>
                                <Text fw={650} lh={"xs"} px={"md"}>{username}</Text>
                                <Space w={"md"}/>
                                <Text px={"md"} fw={200} fz={"sm"}>{format(new Date(time), "dd/MM/yyyy HH:mm")}</Text>
                            </Flex>
                        </CardSection>
                        <CardSection inheritPadding py="xs" pb={"md"}>
                            <Text lh={"xs"} px={"md"} ta={"center"} fw={600}>{response.data.message}</Text>
                        </CardSection>
                    </Card>
                );
                console.log(response);
            }
        } catch (e) {
            console.log(e)
        }
    }
    return (<>
        <Container w={"100%"}>
            <Group m={"md"} align={"flex-start"}>

                <Avatar variant="filled" radius="xl" size="md" mt={"sm"}/>
                {contentStack}
            </Group>
        </Container>
    </>)
}