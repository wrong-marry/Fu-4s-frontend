import {Container, Title, Text, Button, Group} from '@mantine/core';
import classes from './ServerOverload.module.css';
import {Illustration} from './Illustration';
import {useNavigate} from "react-router-dom";

export function ForbiddenPage() {
    const navigate = useNavigate();
    return (
        <div className={classes.root}>
            <Container>
                <div className={classes.inner}>
                    <Illustration className={classes.image}/>
                    <div className={classes.content}>
                        <Title className={classes.title}>All of our servers are busy</Title>
                        <Text size="lg" ta="center" className={classes.description}>
                            We cannot handle your request right now, please wait for a couple of minutes and
                            refresh the page. Our team is already working on this issue.
                        </Text>
                        <Group justify="center">
                            <Button onClick={() => navigate("/")} size="md" variant="white">
                                Go to landing page
                            </Button>
                        </Group>
                    </div>
                </div>
            </Container>
        </div>
    );
}