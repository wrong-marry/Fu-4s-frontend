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
import { blue, green } from "@mui/material/colors";
import { useSearchParams } from "react-router-dom";

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
export default function QuestionDetail(props: any) {
  const [value, setValue] = useState<string | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const handleRadioChange = (selectedValue: string) => {
    setValue(selectedValue);
  };

  const cards = props.question.answers.map((answer: Answer) => {
    const answerState = (isCard: boolean) => {
      if (!showAnswer) return isCard ? classes.checkedAnswer : "blue";
      else if (answer.correct) return isCard ? classes.correct : "green";
      else return isCard ? classes.wrong : "red";
    };
    return (
      <Radio.Card
        className={answerState(true)}
        radius="md"
        value={answer.content}
        key={answer.id}
        checked={value === answer.content || (showAnswer && answer.correct)}
      >
        <Group wrap="nowrap" align="flex-start">
          <Radio.Indicator color={answerState(false)} />
          <div>
            <Text className={classes.label}>{answer.content}</Text>
          </div>
        </Group>
      </Radio.Card>
    );
  });

  return (
    <Card m={15} shadow="md" padding="lg" radius="lg" withBorder>
      <Radio.Group value={value} onChange={setValue}>
        <Text size="md">
          {props.questionIndex}. {props.question.content}
        </Text>
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
