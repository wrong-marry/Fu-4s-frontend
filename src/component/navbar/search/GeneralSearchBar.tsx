import {
  Badge,
  CloseButton,
  Combobox,
  Group,
  Text,
  TextInput,
  useCombobox,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconUser, IconUserStar } from "@tabler/icons-react";
import axios from "axios";
import { useState } from "react";
import {Link, useNavigate} from "react-router-dom";
import { TextInputProps, ActionIcon, useMantineTheme, rem } from '@mantine/core';
import { IconSearch, IconArrowRight } from '@tabler/icons-react';

interface MaterialResponseData {
  id: number;
  postTime: Date;
  content: string;
  title: string;
  subjectCode: string;
  username: string;
}
interface TestResponseData {
  id: number;
  postTime: Date;
  content: string;
  title: string;
  subjectCode: string;
  username: string;
}

interface ResponseData {
  learningMaterials: MaterialResponseData[];
  tests: TestResponseData[];
}

interface Form {
  keywords: string;
}
export const SEARCH_LOAD_SIZE = 4;
const fetchSearchResultData = async (keywords: string) => {
  try {
    const res = await axios.get(`http://localhost:8080/api/v1/search?keyword=${keywords}&pageSize=`+SEARCH_LOAD_SIZE);

    return res.data;
  } catch (error) {}
};

const GeneralSearchBar = () => {
  const navigate = useNavigate();
  const search =(keywords:string)=>{
    navigate(`/search?keyword=${keywords}`);
  };
  const [resData, setResData] = useState<ResponseData>();
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });
  const form = useForm<Form>({
    initialValues: {
      keywords: "",
    },
  });

  const fetchData = async () => {
    const data = await fetchSearchResultData(form.values.keywords);
    const limitedData = {
      learningMaterials: data?.data?.learningMaterials?.slice(0, 4) || [],
      tests: data?.data?.tests?.slice(0, 4) || [],
    };
    setResData(limitedData);
  };

  const handleInputChange = () => {
    if (form.values.keywords.length === 0) {
      combobox.closeDropdown();
    } else {
      fetchData();
      combobox.openDropdown();
      combobox.updateSelectedOptionIndex();
    }
  };


  const learningMaterialsData = resData?.learningMaterials?.map((item) => (
    <Combobox.Option value={item.title} key={item.id}>
      <Link to={`/post/${item.id}`}>
        <Group>
          <Text>{item.title}</Text>
          <Badge
            leftSection={<IconUserStar size={14} stroke={1.5} />}
            color="violet"
            variant="light"
          >{`Uploader: ${item.username}`}</Badge>
        </Group>
      </Link>
    </Combobox.Option>
  ));

  const testsData = resData?.tests?.map((item) => (
    <Combobox.Option value={item.title} key={item.id}>
      <Link to={`/post/${item.id}`}>
        <Group>
          <Text>{item.title}</Text>
          <Badge
            leftSection={<IconUser size={14} stroke={1.5} />}
            color="orange"
            variant="light"
          >{`Uploader: ${item.username}`}</Badge>
        </Group>
      </Link>
    </Combobox.Option>
  ));

  return (
    <>
      <Combobox
        withinPortal={false}
        store={combobox}
        onOptionSubmit={(optionValue) => {
          form.setFieldValue("keywords", optionValue);
          combobox.closeDropdown();
        }}
      >
        <Combobox.Target>
          <TextInput
            placeholder="Search for tests, learningMaterials, etc."
            onBlur={() => combobox.closeDropdown()}
            leftSection={
              form?.values?.keywords !== "" && (
                <CloseButton
                  size="sm"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => {
                    form.reset();
                    combobox.closeDropdown();
                  }}
                  aria-label="Clear value"
                />
              )
            }
            rightSection={
              <ActionIcon size={32} radius="sm" variant="filled"
                          onClick={() => search(form.values.keywords)}
              >
                <IconArrowRight style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
              </ActionIcon>
            }
            onKeyUp={() => handleInputChange()}
            {...form.getInputProps("keywords")}
          />
        </Combobox.Target>
        <Combobox.Dropdown mah={400} className="overflow-y-auto">
          <Combobox.Group label="LearningMaterials">
            <Combobox.Options>
              {resData?.learningMaterials.length !== 0 ? (
                learningMaterialsData
              ) : (
                <Combobox.Empty>Nothing found</Combobox.Empty>
              )}
            </Combobox.Options>
          </Combobox.Group>
          <Combobox.Group label="Tests">
            <Combobox.Options>
              {resData?.tests.length !== 0 ? (
                testsData
              ) : (
                <Combobox.Empty>Nothing found</Combobox.Empty>
              )}
            </Combobox.Options>
          </Combobox.Group>
        </Combobox.Dropdown>
      </Combobox>
    </>
  );
};

export default GeneralSearchBar;
