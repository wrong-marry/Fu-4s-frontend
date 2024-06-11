import * as React from "react";
import PropTypes from "prop-types";
import QuestionSetList from "./QuestionSetList";
import LearningMaterialList from "./LearningMaterialList";
import {Box, Center, Tabs} from "@mantine/core";

interface Object3Props {
  children?: React.ReactNode;
  index: number;
    value: string;
}

function Object3(props: Object3Props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value != index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
        {value == index && (
            <Box px={3}>
                {children}
        </Box>
      )}
    </div>
  );
}

Object3.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
    value: PropTypes.string.isRequired,
};

export default function BasicTabs() {
    const [value, setValue] = React.useState<string>(0);

  return (
      <Box w={"100%"} mt={"md"}>
          <Box style={{borderBottom: 1, borderColor: "divider"}}>
              <Center>
                  <Tabs value={value} onChange={setValue}>
                      <Tabs.List>
                          <Tabs.Tab value="all">
                              All
                          </Tabs.Tab>
                          <Tabs.Tab value="test">
                              Mock test
                          </Tabs.Tab>
                          <Tabs.Tab value="material">
                              Learning material
                          </Tabs.Tab>
                      </Tabs.List>

                      <Tabs.Panel value="gallery">
                          Gallery tab content
                      </Tabs.Panel>

                      <Tabs.Panel value="messages">
                          Messages tab content
                      </Tabs.Panel>

                      <Tabs.Panel value="settings">
                          Settings tab content
                      </Tabs.Panel>
                  </Tabs>
              </Center>
      </Box>
      <Object3 value={value} index={0}>
        <QuestionSetList />
      </Object3>
      <Object3 value={value} index={1}>
        <LearningMaterialList />
      </Object3>
      <Object3 value={value} index={2}>
        Item three
      </Object3>
    </Box>
  );
}
