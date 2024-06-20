import { useSearchParams } from "react-router-dom";
import QuestionDetail, {
  Question,
} from "../../component/question/QuestionDetail";
import { fetchQuestion } from "../../util/QuestionUtil";
import { useEffect, useState } from "react";
import {
  Affix,
  Badge,
  Button,
  Card,
  Flex,
  Grid,
  Group,
  Modal,
  Text,
  Title,
  Transition,
  rem,
} from "@mantine/core";
import { useWindowScroll } from "@mantine/hooks";
import { IconArrowUp } from "@tabler/icons-react";
import { format } from "date-fns";
import QuizIcon from "@mui/icons-material/Quiz";
import { isLoggedIn } from "../../util/loader/Auth";
import LearningMaterialDetail from "../../component/learning-material/LearningMaterialDetail";
import CustomizeTestModal from "../../component/test-modals/CustomizeTestModal";

export default function MockTestDetailPage(post: any) {
  const [testFormOpened, setTestFormOpened] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [scroll, scrollTo] = useWindowScroll();
  let questionIndex = 0;
  useEffect(() => {
    const fetchData = async () => {
      const res = await fetchQuestion(post.id);
      setQuestions(res.data);
    };
    fetchData();
  }, []);
  const questionsDisplay = questions.map((question: Question) => {
    ++questionIndex;
    return <QuestionDetail questionIndex={questionIndex} key={question.id} question={question} />;
  });
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
            {post.title}
          </Title>
          <Grid>
            <Grid.Col span={4}>
              <Modal
                opened={testFormOpened}
                onClose={() => setTestFormOpened(false)}
                title={
                  isLoggedIn()
                    ? "Customize your test"
                    : "BRUH NOT LOGGED IN BRUHH!"
                }
              >
                {isLoggedIn() ? (
                  <CustomizeTestModal numberOfQuestion={questions.length} id={post.id} />
                ) : (
                  <Text>BRUH NOT LOGGED IN BRUHH!</Text>
                )}
              </Modal>
              <Button
                radius="lg"
                onClick={() => {
                  setTestFormOpened(true);
                }}
              >
                {" "}
                <QuizIcon className="mr-2" /> Take test
              </Button>
            </Grid.Col>
            <Grid.Col span={7}>
              <Group justify="end" align="center">
                <Badge color="pink" size="lg">
                  Created by {post.username}
                </Badge>
                <Badge color="purple" size="lg">
                  {format(new Date(post.postTime), "dd/MM/yyyy HH:mm")}
                </Badge>
              </Group>
            </Grid.Col>
          </Grid>

          <>{questionsDisplay}</>
        </Grid.Col>
      </Grid>
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
    </>
  );
}
