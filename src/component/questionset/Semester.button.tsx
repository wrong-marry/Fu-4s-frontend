import * as React from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import QuestionSetList from "./QuestionSetList";

interface Object3Props {
	children?: React.ReactNode;
	index: number;
	value: number;
}

function Object3(props: Object3Props) {
	const { children, value, index, ...other } = props;

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			{...other}
		>
			{value === index && (
				<Box sx={{ p: 3 }}>
					<Typography>{children}</Typography>
				</Box>
			)}
		</div>
	);
}

Object3.propTypes = {
	children: PropTypes.node,
	index: PropTypes.number.isRequired,
	value: PropTypes.number.isRequired,
};

function a11yProps(index: number) {
	return {
		id: `simple-tab-${index}`,
		"aria-controls": `simple-tabpanel-${index}`,
	};
}

export default function BasicTabs() {
	const [value, setValue] = React.useState<number>(0);

	const handleChange = (event: React.SyntheticEvent, newValue: number) => {
		setValue(newValue);
	};

	return (
		<Box sx={{ width: "100%" }}>
			<Box sx={{ borderBottom: 1, borderColor: "divider" }}>
				<Tabs
					value={value}
					onChange={handleChange}
					aria-label="basic tabs example"
				>
					<Tab label="Mock Tests" {...a11yProps(0)} />
					<Tab label="Learning Materials" {...a11yProps(1)} />
					<Tab label="All" {...a11yProps(2)} />
				</Tabs>
			</Box>
			<Object3 value={value} index={0}>
				<QuestionSetList />
			</Object3>
			<Object3 value={value} index={1}>
				Item two
			</Object3>
			<Object3 value={value} index={2}>
				Item three
			</Object3>
		</Box>
	);
}
