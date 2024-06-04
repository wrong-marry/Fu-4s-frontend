import {
  Button,
  Flex,
  NumberInput,
  Switch,
  Text,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CustomizeTestModal(prop: any) {
  const [numberOfQuestions, setNumberOfQuestions] = useState(1);
  const navigate = useNavigate();
  const form = useForm({
    initialValues: {
      numberOfQuestions: 1,
      personalized: false,
    },
  });
  return (
    <form
      onSubmit={
        //async (e) =>
        //e.preventDefault();
        form.onSubmit(() => {})
      }
    >
      <Text mb={15}>
        This is test mode. A number of questions are picked randomly or based on
        your previous attempts.
      </Text>
      <Text mb={5}>Number of questions (1 - 40)</Text>
      <NumberInput
        {...form.getInputProps("numberOfQuestions")}
        key={form.key("numberOfQuestions")}
        mb={20}
        placeholder="Don't enter more than 40 and less than 1"
        min={1}
        max={40}
      />

      <Flex justify="space-between">
        <Switch
          {...form.getInputProps("personalized")}
          key={form.key("personalized")}
          mb={20}
          label="Personalization"
          size="md"
          onLabel="Personalized"
          offLabel="Random"
        />
        <Button
          onClick={() => {
            const url = `/test?id=${prop.id}&number-of-questions=${
              form.values.numberOfQuestions
            }&mode=${form.values.personalized ? "personalized" : "random"}`;
            navigate(url);
          }}
          type="submit"
        >
          Go to test
        </Button>
      </Flex>
    </form>
  );
}
