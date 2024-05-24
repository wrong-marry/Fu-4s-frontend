import * as React from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import ButtonGroup from "@mui/material/ButtonGroup";

export default function Object2() {
	const [selectedButton, setSelectedButton] = React.useState<string>("one");

	const handleButtonClick = (key: string) => {
		setSelectedButton(key);
	};

	const getHeaderText = (buttonKey: string) => {
		switch (buttonKey) {
			case "one":
				return "SSL101c-Academic skills for University success";
			case "two":
				return "CSI104-Introduction to Computer Science";
			case "three":
				return "PRF192-Programming Fundamentals";
			case "four":
				return "MAE101-Mathematics for Engineering";
			case "five":
				return "CEA201-Computer Organization and Architecture";
			default:
				return "";
		}
	};

	const buttons = [
		<Button
			key="one"
			variant={selectedButton === "one" ? "contained" : "outlined"}
			onClick={() => handleButtonClick("one")}
		>
			SSL101c
		</Button>,
		<Button
			key="two"
			variant={selectedButton === "two" ? "contained" : "outlined"}
			onClick={() => handleButtonClick("two")}
		>
			CSI104
		</Button>,
		<Button
			key="three"
			variant={selectedButton === "three" ? "contained" : "outlined"}
			onClick={() => handleButtonClick("three")}
		>
			PRF192
		</Button>,
		<Button
			key="four"
			variant={selectedButton === "four" ? "contained" : "outlined"}
			onClick={() => handleButtonClick("four")}
		>
			MAE101
		</Button>,
		<Button
			key="five"
			variant={selectedButton === "five" ? "contained" : "outlined"}
			onClick={() => handleButtonClick("five")}
		>
			CEA201
		</Button>,
	];

	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				"& > *": {
					m: 1,
				},
			}}
		>
			<h1 style={{ color: "palevioletred" }}>Kì 1</h1>
			<ButtonGroup color="secondary" aria-label="Medium-sized button group">
				{buttons}
			</ButtonGroup>
			<h1 style={{ color: "palevioletred" }}>
				{getHeaderText(selectedButton)}
			</h1>
		</Box>
	);
}
