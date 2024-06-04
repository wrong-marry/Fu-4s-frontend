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
  const [checked,setChecked] = useState(false);
  const handleRadioChange = (selectedValue: string) => {
    setValue(selectedValue);
  };

  const cards = props.question.answers.map((answer: Answer) => {
    const answerState = (isCard:boolean) => {
      if(!showAnswer)
        return isCard?classes.checkedAnswer:"blue"
      else if(answer.correct)
        return isCard?classes.correct:"green"
      else
        return isCard?classes.wrong:"red"
    } 
    return (
      <Radio.Card
        className={
          answerState(true)
        }
        onClick={()=>{
            if(!checked)
                {
                    props.increaseNumberOfQuestionsChecked();
                    setChecked(true);
                }
            if(checked&&value===answer.content){
                setChecked(false);
                props.decreaseNumberOfQuestionsChecked();
            }
        }}
        radius="md"
        value={answer.content}
        key={answer.id}
        checked={checked&&(value === answer.content || (showAnswer && answer.correct))}
        onChangeCapture={() => handleRadioChange(answer.content)}
      >
        <Group wrap="nowrap" align="flex-start">
          <Radio.Indicator
            color={answerState(false)}
          />
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
        <Text size="md">{props.questionIndex}. {props.question.content}</Text>
        <Stack pt="md" gap="xs">
          {cards}
        </Stack>
      </Radio.Group>
    </Card>
  );
}
