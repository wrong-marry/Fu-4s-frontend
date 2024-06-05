import { Text, Progress, Card, Button } from "@mantine/core";
import classes from "./ProgressCardColored.module.css";
import { useEffect, useState } from "react";
import { notifications } from "@mantine/notifications";

export function ProgressCardColored(props: any) {
  return (
    <Card withBorder radius="lg" p="md" className={classes.card}>
      <Text fz="xs" tt="uppercase" fw={700} className={classes.title}>
        Test Progress
      </Text>
      <Text fz="lg" fw={500} className={classes.stats}>
        {props.numberOfQuestionChecked} / {props.numberOfQuestion}
      </Text>
      <Progress
        value={(props.numberOfQuestionChecked * 100) / props.numberOfQuestion}
        mt="md"
        size="lg"
        radius="xl"
        transitionDuration={1500}
        classNames={{
          root: classes.progressTrack,
          section: classes.progressSection,
        }}
      />
      <Button mt={10} fz="xs" size="compact-md" radius="xl">
        Submit
      </Button>
      <Button
        size="compact-md"
        fz="xs"
        radius="xl"
        onClick={() => {
          const quotes = [
            "“An investment in knowledge pays the best interest.”",
            "“The capacity to learn is a gift; the ability to learn is a skill; the willingness to learn is a choice.”",
            "“I’ve failed over and over and over again in my life. And that is why I succeed.”",
            "“Failure is the opportunity to begin again more intelligently.”",
            "“Teachers open the door, but you must enter by yourself”",
            "“Learning is the only thing the mind never exhausts, never fears, and never regrets.”",
          ];
          const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
          notifications.show({
            title: randomQuote,
            message: `Keep going! You have done ${
              (props.numberOfQuestionChecked * 100) / props.numberOfQuestion
            }% of the test`,
          });
        }}
      >
        need encouragement?
      </Button>
    </Card>
  );
}
