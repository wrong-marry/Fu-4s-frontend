import {useEffect, useState} from "react";
import {Box} from "@mantine/core";
import {AreaChart} from "@mantine/charts";
import {BASE_URL} from "../../../common/constant.tsx";

export const Area = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem("token");
            const response = await fetch(
                `${BASE_URL}/api/v1/staff/getStatisticAboutPostEachSubject`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            const jsonData = await response.json();
            setData(jsonData); // Cập nhật state với dữ liệu nhận được
        };

        fetchData();
    }, []);

    return (
        <Box>
            <h1
                style={{
                    textAlign: "center",
                    color: "rgba(2, 104, 207, 1)",
                    fontFamily: "Courier New, monospace",
                    fontWeight: "bold",
                    padding: "20px",
                }}
            >
                Posts per Course Over Time
                <ul>
                    {Object.entries(data).map(
                        (
                            [subject, stats] // Sử dụng dữ liệu từ state
                        ) => (
                            <li key={subject}>
                                {subject}:{" "}
                                {Object.entries(stats).map(
                                    ([month, count]) => `${month}: ${count}, `
                                )}
                            </li>
                        )
                    )}
                </ul>
            </h1>
            <AreaChart
                h={300}
                data={data}
                dataKey="date"
                series={[
                    {name: "Staffs", color: "indigo.6"},
                    {name: "Admin", color: "blue.6"},
                    {name: "Users", color: "teal.6"},
                ]}
                curveType="bump"
            />
        </Box>
    );
};
