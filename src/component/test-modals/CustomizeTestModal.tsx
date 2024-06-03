import { Button, Flex, NumberInput, Switch, Text } from "@mantine/core";

export default function CustomizeTestModal() {
  return (
    <>
      <Text mb={15}>
        This is test mode. A number of questions are picked randomly or based on
        your previous attempts.
      </Text>
      <Text mb={5}>Number of questions (1 - 40)</Text>
      <NumberInput
        mb={20}
        placeholder="Don't enter more than 40 and less than 1"
        min={1}
        max={40}
      />
      
      <Flex justify="space-between">
      <Switch
        mb={20}
        label="Personalization"
        size="md"
        onLabel="Personalized"
        offLabel="Random"
      />
        <Button type="submit">Go to test</Button>
      </Flex>
    </>
  );
}
