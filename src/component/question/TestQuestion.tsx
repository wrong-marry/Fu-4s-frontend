import { useEffect, useState } from "react";
import ClearIcon from '@mui/icons-material/Clear';
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
  CheckIcon,
} from "@mantine/core";
import classes from "./Demo.module.css";
import { color } from "@mui/system";
import { blue, green } from "@mui/material/colors";
import { useSearchParams } from "react-router-dom";
import { forEach } from "lodash";
import { boolean } from "zod";

interface Question {
  id: number;
  content: string;
  answers: Answer[];
}
interface Answer {
  id: number;
  content: string;
  correct: boolean;
}
export default function TestQuestion(props: any) {
  const [value, setValue] = useState<string | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [checked, setChecked] = useState(false);
  const [questionIsCorrect, setQuestionIsCorrect] = useState(false);

  const pickCorrectAnswer = (correct: boolean) => {
    props.modifyNumberOfCorrectAnswers(correct);
    setQuestionIsCorrect(correct);
  };

  const handleRadioChange = (selectedValue: string, isCorrect: boolean) => {
    const newValue = selectedValue;
    const oldValue = value;
    setValue(newValue);
    //marking purpose
    if (!checked) {
      // if question isn't checked and the picked answer is correct
      if (isCorrect) pickCorrectAnswer(true);
    }
    //if question is checked
    else {
      //if the picked answer is correct
      if (isCorrect) {
        //if the previous answer is the same as the picked answer
        if (oldValue === newValue) pickCorrectAnswer(false);
        else pickCorrectAnswer(true);
      }
      //if the picked answer is wrong
      else {
        //if the question is already correctly answered
        if (questionIsCorrect) pickCorrectAnswer(false);
      }
    }

    //Styling purpose
    if (!checked) {
      props.increaseNumberOfQuestionsChecked();
      setChecked(true);
    }
    if (checked && oldValue === newValue) {
      setChecked(false);
      props.decreaseNumberOfQuestionsChecked();
    }
  };

  const incorrectText = () => {
    return checked?"Oopsssie! Your answer was incorrect, try harder!":"There was a chance to answer this correctly but you made it 100% wrong by not answering -.-"
  }

  const cards = props.question.answers.map((answer: Answer) => {
    const answerState = (isCard: boolean) => {
      if (!props.reviewing) return isCard ? classes.checkedAnswer : "blue";
      else if (answer.correct) return isCard ? classes.correct : "green";
      else return isCard ? classes.wrong : "red";
    };
    return (
      <Radio.Card
        disabled={props.reviewing}
        className={answerState(true)}
        onClick={() => {
          handleRadioChange(answer.content, answer.correct);
        }}
        radius="md"
        value={answer.content}
        key={answer.id}
        checked={
          (value === answer.content && checked) ||
          (props.reviewing && answer.correct)
        }
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
      <Radio.Group value={value}>
        <Text size="md">
          {props.questionIndex}. {props.question.content}
        </Text>
        <Text display={props.reviewing?"block":"none"} c={questionIsCorrect?"green":"red"} >
          {questionIsCorrect?"Good job! Your answer was correct":incorrectText()}
        </Text>
        <Stack pt="md" gap="xs">
          {cards}
        </Stack>
      </Radio.Group>
    </Card>
  );
}
