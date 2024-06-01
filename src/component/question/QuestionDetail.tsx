import { useState } from "react";
import {
  Radio,
  Group,
  Stack,
  Text,
  Card,
  rgba,
  Grid,
  Flex,
  Button,
} from "@mantine/core";
import classes from "./Demo.module.css";
import { color } from "@mui/system";
import { green } from "@mui/material/colors";

export interface Question {
  id: number;
  content: string;
  answers: Answer[];
}
interface Answer {
  id: number;
  content: string;
  correct: boolean;
}
export default function QuestionDetail(question: Question) {
  const [value, setValue] = useState<string | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const cards = question.answers.map((answer: Answer) => (
    <Radio.Card

      className={classes.root}
      radius="md"
      value={answer.content}
      key={answer.id}
      checked={showAnswer && answer.correct}
    >
      <Group wrap="nowrap" align="flex-start">
        <Radio.Indicator color="green" />
        <div>
          <Text className={classes.label}>{answer.content}</Text>
        </div>
      </Group>
    </Radio.Card>
  ));

  return (
    <Card m={15} shadow="md" padding="lg" radius="lg" withBorder>
      <Radio.Group value={value} onChange={setValue}>
        <Text size="md">{question.content}</Text>
        <Stack pt="md" gap="xs">
          {cards}
        </Stack>
      </Radio.Group>

      <Grid mt={15}>
        <Grid.Col span={2}>
          <Button radius="md" onClick={() => setShowAnswer(!showAnswer)}>
            {!showAnswer ? "Show Answer" : "Hide Answer"}
          </Button>
        </Grid.Col>
        <Grid.Col span={10}></Grid.Col>
      </Grid>
    </Card>
  );
}
