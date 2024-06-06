import { Title, Text, Button, Container, Grid, GridCol } from "@mantine/core";
import classes from "./HeroText.module.css";
import { Dots } from "./Dots";

export function HeroText(props:any) {
  return (
    <Container className={classes.wrapper} size={1400}>
      <Dots className={classes.dots} style={{ left: 0, top: 0 }} />
      <Dots className={classes.dots} style={{ left: 60, top: 0 }} />
      <Dots className={classes.dots} style={{ left: 0, top: 140 }} />
      <Dots className={classes.dots} style={{ right: 0, top: 60 }} />

      <div className={classes.inner}>
        <Title className={classes.title}>
          No more questions!{" "}
          <Text component="span" className={classes.highlight} inherit>
            Are you ready
          </Text>{" "}
          to submit your test?
        </Title>

        <Container p={0} size={600}>
          <Text size="lg" c="dimmed" className={classes.description}>
            After submitting your test, you will be able to see the result
            immediately and this result will be saved in your test history!
          </Text>
        </Container>

        <div className={classes.controls}>
          <Button onClick={props.handleSubmit} className={classes.control} size="lg">
            Submit
          </Button>
        </div>
      </div>
    </Container>
  );
}
