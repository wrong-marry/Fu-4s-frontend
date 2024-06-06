import { useNavigate, useSearchParams } from "react-router-dom";
import QuestionDetail, {
  Question,
} from "../../component/question/QuestionDetail";
import { fetchQuestion, fetchRandomQuestion } from "../../util/QuestionUtil";
import { useEffect, useRef, useState } from "react";
import {
  Affix,
  Badge,
  Button,
  Card,
  Center,
  Flex,
  Grid,
  Group,
  Modal,
  Notification,
  Paper,
  RingProgress,
  Text,
  Title,
  Transition,
  rem,
} from "@mantine/core";
import { useWindowScroll } from "@mantine/hooks";
import { IconArrowUp, IconCheck } from "@tabler/icons-react";
import { format } from "date-fns";
import QuizIcon from "@mui/icons-material/Quiz";
import { isLoggedIn } from "../../util/loader/Auth";
import LearningMaterialDetail from "../../component/learning-material/LearningMaterialDetail";
import CustomizeTestModal from "../../component/test-modals/CustomizeTestModal";
import axios, { AxiosResponse } from "axios";
import { Post } from "../post/PostPage";
import TestQuestion from "../../component/question/TestQuestion";
import { HeroText } from "../../component/hero-text/HeroText";
import { ProgressCardColored } from "../../component/progress-card/ProgressCard";
import { notifications } from "@mantine/notifications";
import { IconArrowDown } from "@tabler/icons-react";
import { green } from "@mui/material/colors";
import TestScore from "../../component/test-mark/TestScore";
export default function TakingTestPage() {
  const [searchParam, setSearchParam] = useSearchParams();
  const id = searchParam.get("id");
  const numberOfQuestion = searchParam.get("number-of-questions");
  const mode = searchParam.get("mode");
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [scroll, scrollTo] = useWindowScroll();
  const [post, setPost] = useState<Post | null>(null);
  const [numberOfQuestionChecked, setNumberOfQuestionsChecked] = useState(0);
  const bottom = useRef<HTMLElement | null>(null);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [reviewing, setReviewing] = useState(false);

  let questionIndex = 0;

  useEffect(() => {
    const fetchData = async () => {
      if (id != null && numberOfQuestion != null) {
        const res = await fetchRandomQuestion(id, Number(numberOfQuestion));
        setQuestions(res.data);
      } else navigate("/forbidden");
    };
    const fetchPost = async () => {
      try {
        const response: AxiosResponse<Post> = await axios.get(
          `http://localhost:8080/api/v1/post/get?id=${id}`
        );
        setPost(response.data);
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };
    fetchPost();
    fetchData();
  }, []);

  const increaseNumberOfQuestionsChecked = () => {
    setNumberOfQuestionsChecked(numberOfQuestionChecked + 1);
  };

  const decreaseNumberOfQuestionsChecked = () => {
    setNumberOfQuestionsChecked(numberOfQuestionChecked - 1);
  };

  const modifyNumberOfCorrectAnswers = (isAdd: boolean) => {
    isAdd
      ? setCorrectAnswers(correctAnswers + 1)
      : setCorrectAnswers(correctAnswers - 1);
  };

  const questionsDisplay = questions.map((question: Question) => {
    ++questionIndex;
    return (
      <TestQuestion
        reviewing={reviewing}
        key={question.id}
        question={question}
        questionIndex={questionIndex}
        modifyNumberOfCorrectAnswers={modifyNumberOfCorrectAnswers}
        increaseNumberOfQuestionsChecked={increaseNumberOfQuestionsChecked}
        decreaseNumberOfQuestionsChecked={decreaseNumberOfQuestionsChecked}
      />
    );
  });
  const date = () => {
    if (post != null)
      return format(new Date(post.postTime), "dd/MM/yyyy HH:mm");
    else return "";
  };

  const handleSubmit = () => {
    setReviewing(true);
    scrollTo({ y: 0 });
  };

  return (
    <>
      <Grid display={Flex} justify="center">
        <Grid.Col span={{ base: 12, md: 8 }}>
          <Group justify="center">
            <Badge mt={15} variant="filled" size="lg">
              Mock Test
            </Badge>
          </Group>
          <Title order={2} className="text-3xl font-md" ta="center" my={30}>
            {post?.title}
          </Title>

          <Grid>
            <Grid.Col span={4}>
              <Badge color="pink" size="lg">
                Test Mode
              </Badge>
            </Grid.Col>
            <Grid.Col span={7}>
              <Group justify="end" align="center">
                <Badge color="pink" size="lg">
                  Created by {post?.username}
                </Badge>
                <Badge color="purple" size="lg">
                  {date()}
                </Badge>
              </Group>
            </Grid.Col>
          </Grid>
          <Grid display={reviewing ? "block" : "none"}>
            <Grid.Col span={6}>
              <Paper withBorder radius="lg" p="lg" my="md" shadow="lg">
                <Group>
                  <RingProgress
                    size={80}
                    thickness={8}
                    sections={[
                      {
                        value:
                          (correctAnswers * 100) / Number(numberOfQuestion),
                        color: "green",
                      },
                    ]}
                    rootColor="red"
                    label={
                      <Center>
                        <IconCheck
                          style={{ width: rem(20), height: rem(20) }}
                          stroke={1.5}
                        />
                      </Center>
                    }
                  />

                  <div>
                    <Text c="dimmed" size="xs" tt="uppercase" fw={700}>
                      Number of correct answers
                    </Text>
                    <Text fw={700} size="xl">
                      {correctAnswers} / {numberOfQuestion}
                    </Text>
                  </div>
                </Group>
              </Paper>
            </Grid.Col>
            <Grid.Col my="md" span={6}>
              <TestScore
                correctAnswers={correctAnswers}
                numberOfQuestion={numberOfQuestion}
              />
            </Grid.Col>
          </Grid>
          <>{questionsDisplay}</>
        </Grid.Col>
      </Grid>
      <HeroText handleSubmit={handleSubmit} />
      <section ref={bottom}></section>
      <Affix position={{ bottom: 20, right: 20 }}>
        <Transition transition="slide-up" mounted={scroll.y > 0}>
          {(transitionStyles) => (
            <Button
              leftSection={
                <IconArrowUp style={{ width: rem(16), height: rem(16) }} />
              }
              style={transitionStyles}
              onClick={() => scrollTo({ y: 0 })}
            >
              Scroll to top
            </Button>
          )}
        </Transition>
      </Affix>
      <Affix position={{ top: 150, right: 20 }}>
        <ProgressCardColored
          handleSubmit={handleSubmit}
          numberOfQuestion={numberOfQuestion}
          numberOfQuestionChecked={numberOfQuestionChecked}
        />
      </Affix>
    </>
  );
}
