import { useEffect, useState } from "react";
import { BarChart } from "@mantine/charts";
import { Box, Center, Checkbox, Group, Text } from "@mantine/core";
import "@mantine/charts/styles.css";
import { BASE_URL } from "../../../common/constant.tsx";

// Giả sử URL API
const API_URL = "/api/v1/post/subject/count-";

interface ChartData {
  subject: string;
  NumberOfPosts: number;
}

const fetchData = async (subject: string): Promise<number> => {
  const response = await fetch(`${BASE_URL}${API_URL}${subject}`);
  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }
  const data = await response.json();
  return data; // Điều chỉnh theo cấu trúc dữ liệu API trả về
};

export function Bar() {
  const [data, setData] = useState<ChartData[]>([]);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [subjectCodes, setSubjectCodes] = useState<string[]>([]);

  useEffect(() => {
    const fetchSubjectCodes = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${BASE_URL}/api/v1/subject/getAllSubjectCodes`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          setSubjectCodes(data); //  API trả về mảng các subject codes
        } else {
          console.error("Failed to fetch subject codes");
        }
      } catch (error) {
        console.error("Error fetching subject codes:", error);
      }
    };

    fetchSubjectCodes();
  }, []);

  useEffect(() => {
    if (selectedSubjects.length > 0) {
      const fetchAllData = async () => {
        setLoading(true);
        setError(null);
        try {
          const results = await Promise.all(
            selectedSubjects.map(async (subject) => {
              return {
                subject,
                NumberOfPosts : await fetchData(subject),
              };
            })
          );
          setData(results);

          console.log(results);
        } catch (err) {
          setError("Error fetching data");
        } finally {
          setLoading(false);
        }
      };
      fetchAllData();
    } else {
      setData([]); // Xóa dữ liệu khi không có môn học nào được chọn
    }
  }, [selectedSubjects]);

  const handleSubjectChange = (subject: string) => {
    setSelectedSubjects((prev) => {
      if (prev.includes(subject)) {
        return prev.filter((s) => s !== subject);
      } else if (prev.length < 10) {
        return [...prev, subject];
      } else {
        return prev;
      }
    });
  };

  return (
    <Box>
      <Text fz="lg" mb="md" ta="center" fw="bold">
        BAR CHART ABOUT THE NUMBER OF POSTS BY SUBJECT
      </Text>

      <Group style={{ padding: "34px" }}>
        {subjectCodes.map((subject) => (
          <Checkbox
            key={subject}
            label={subject}
            checked={selectedSubjects.includes(subject)}
            onChange={() => handleSubjectChange(subject)}
            disabled={
              selectedSubjects.length >= 10 &&
              !selectedSubjects.includes(subject)
            }
          />
        ))}
      </Group>

      {loading && <Text style={{ textAlign: "center" }}>Loading...</Text>}
      {error && (
        <Text style={{ textAlign: "center", color: "red" }}>{error}</Text>
      )}

      <Center>
	  {data.length > 0 && !loading && !error && (
        <BarChart
		w={data.length == 1?700:1400}
          onClick={() => console.log(data)}
          h={300}
          data={data}
          dataKey="subject"
          series={[{ name: "NumberOfPosts", color: "blue.6" }]}
          tickLine="y"
        />

      )}
	  </Center>

    </Box>
  );
}
