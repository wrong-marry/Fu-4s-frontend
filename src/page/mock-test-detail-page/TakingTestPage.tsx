import { useNavigate, useSearchParams } from "react-router-dom";
import QuestionDetail, {
  Question,
} from "../../component/question/QuestionDetail";
import { fetchQuestion, fetchRandomQuestion } from "../../util/QuestionUtil";
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

export default function TakingTestPage() {
  const [searchParam, setSearchParam] = useSearchParams();
  const id = searchParam.get("id");
  const numberOfQuestion = searchParam.get("number-of-questions");
  const mode = searchParam.get("mode");
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [scroll, scrollTo] = useWindowScroll();
  useEffect(() => {
    const fetchData = async () => {
        if(id!=null&&numberOfQuestion!=null){
        const res = await fetchRandomQuestion(id,Number(numberOfQuestion));
        setQuestions(res.data);}
      navigate("/forbidden");
    };
    fetchData();
  }, []);
  const questionsDisplay = questions.map((question: Question) => (
    <QuestionDetail key={question.id} {...question} />
  ));
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
              <Badge color="pink" size="lg">
                Test Mode
              </Badge>
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
