import { useState } from "react";
import { Radio, Group, Stack, Text, Card, rgba, Grid, Flex } from "@mantine/core";
import classes from "./Demo.module.css";
import { color } from "@mui/system";
import { green } from "@mui/material/colors";

const data = [
  {
    name: "@mantine/coredsafdsafdsafds afdsafdsafdsafdsafdsafdsafdsafdsafdsafdsafdasfdsafdsafdsafdsafdsafdsafd safdsafdsafdsafdsafdsafdsafdsafdsafdsafdsafdsafdsafdsafdm saklnfklsanfkldnsaklfndsklanfkdlsanfkdsnalkfdnsala",
  },
  { name: "@mantine/hooks" ,
    correct: true
  },
  { name: "@mantine/notifications" ,
    correct: true
  },
  { name: "@mantSe/notifications" },
];

export default function QuestionDetail() {
  const [value, setValue] = useState<string | null>(null);

  const cards = data.map((item) => (
    <Radio.Card
      className={classes.root}
      radius="md"
      value={item.name}
      key={item.name}
    >
      <Group wrap="nowrap" align="flex-start">
        <Radio.Indicator color="green" />
        <div>
          <Text className={classes.label}>{item.name}</Text>
        </div>
      </Group>
    </Radio.Card>
  ));

  return (
    <Grid display={Flex} justify="center">
      <Grid.Col span={{base:12,md:8}}>
        <Card m={30} shadow="sm" padding="lg" radius="md" withBorder>
          <Radio.Group
            value={value}
            onChange={setValue}
            label="Pick one package to install"
            description="Choose a package that you will need in your application"
          >
            <Stack pt="md" gap="xs">
              {cards}
            </Stack>
          </Radio.Group>

          <Text fz="xs" mt="md">
            CurrentValue: {value || "–"}
          </Text>
        </Card>
      </Grid.Col>
    </Grid>
  );
}
