import * as React from "react";
import PropTypes from "prop-types";
import PostList from "./PostList.tsx";
import {Box, Center, Tabs} from "@mantine/core";
import {POST_PAGE_SIZE, SearchRequest} from "../../page/search/SearchPage.tsx";
import {SearchOrder} from "../../page/search/SearchPage.tsx";

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

export default function BasicTabs(props: { subject: string | undefined, key: string | undefined }) {
    const [searchRequest] = React.useState<SearchRequest>({
        username: null,
        title: null,
        subjectCode: props.subject,
        postTime: null,
        isTest: null,
        order: SearchOrder[SearchOrder.DATE_DESC],
        pageSize: POST_PAGE_SIZE,
        currentPage: 1,
        semester: null
    } as SearchRequest);
  return (
      <Box mt="md" style={{borderBottom: 1, borderColor: "divider"}}>
          <Center>
              <Tabs defaultValue={"all"}>
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

                  <Tabs.Panel value="all">
                      <PostTypeTab value={"0"} index={0}>
                          <PostList searchRequest={searchRequest}/>
                      </PostTypeTab>
                      </Tabs.Panel>

                  <Tabs.Panel value="test">
                      <PostTypeTab value={"1"} index={1}>
                          <PostList searchRequest={{...searchRequest, isTest: true}}/>
                      </PostTypeTab>
                      </Tabs.Panel>

                  <Tabs.Panel value="material">
                      <PostTypeTab value={"2"} index={2}>
                          <PostList searchRequest={{...searchRequest, isTest: false}}/>
                      </PostTypeTab>
                      </Tabs.Panel>
                  </Tabs>
              </Center>
      </Box>
  );
}
