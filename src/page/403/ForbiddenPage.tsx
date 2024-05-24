import { Container, Title, Text, Button, Group } from '@mantine/core';
import classes from './ServerOverload.module.css';
import { Illustration } from './Illustration';

export function ForbiddenPage() {
  return (
    <div className={classes.root}>
      <Container>
        <div className={classes.inner}>
          <Illustration className={classes.image} />
          <div className={classes.content}>
            <Title className={classes.title}>All of our servers are busy</Title>
            <Text size="lg" ta="center" className={classes.description}>
              We cannot handle your request right now, please wait for a couple of minutes and
              refresh the page. Our team is already working on this issue.
            </Text>
            <Group justify="center">
              <Button size="md" variant="white">
                Go to landing page
              </Button>
            </Group>
          </div>
        </div>
      </Container>
    </div>
  );
}