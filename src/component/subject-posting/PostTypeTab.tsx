import * as React from "react";
import PropTypes from "prop-types";
import QuestionSetList from "./QuestionSetList";
import LearningMaterialList from "./LearningMaterialList";
import {Box, Center, Tabs} from "@mantine/core";

interface PostTypeTabProps {
  children?: React.ReactNode;
  index: number;
    value: string;
}

function PostTypeTab(props: PostTypeTabProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value != index + ""}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
        {value == index + "" && (
            <Box px={3}>
                {children}
        </Box>
      )}
    </div>
  );
}

PostTypeTab.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
    value: PropTypes.string.isRequired,
};

export default function BasicTabs() {
    const [value, setValue] = React.useState<string>("0");

  return (
      <Box w={"100%"} mt={"md"}>
          <Box style={{borderBottom: 1, borderColor: "divider"}}>
              <Center>
                  <Tabs value={value} onChange={() => {
                      setValue(value)
                  }}>
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
          <PostTypeTab value={value} index={0}>
        <QuestionSetList />
          </PostTypeTab>
          <PostTypeTab value={value} index={1}>
        <LearningMaterialList />
          </PostTypeTab>
          <PostTypeTab value={value} index={2}>
        Item three
          </PostTypeTab>
    </Box>
  );
}
