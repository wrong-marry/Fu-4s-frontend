import {Card, Center, Container, Text} from "@mantine/core"

export default function Comment(props) {
    const username = props.username;
    const content = props.content;
    return (<>
        <Container w={"100%"}>
            <Center m={"md"}>
                <Card w={"100%"} p={"md"} withBorder>
                    <Text>{username}</Text>
                    <Text>{content}</Text>
                </Card>
            </Center>
        </Container>
    </>)
}