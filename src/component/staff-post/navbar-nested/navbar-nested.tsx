import { Group, Code, ScrollArea } from "@mantine/core";
import {
	IconNotes,
	IconGauge,
	IconLock,
} from "@tabler/icons-react";
import { UserButton } from "../user-button/UserButton";
import { LinksGroup } from "../navbar-linksgroup/NavbarLinksGroup.tsx";
import classes from "./NavbarNested.module.css";

const mockdata = [
	{ label: "Dashboard", icon: IconGauge },
	{
		label: "Task news",
		icon: IconNotes,
		initiallyOpened: true,
		links: [
			{ label: "Overview", link: "/" },
			{ label: "Pending Posts", link: "/" },
			{ label: "Pending Comments", link: "/" },
		],
	},
	{
		label: "Security",
		icon: IconLock,
		links: [
			{ label: "Enable 2FA", link: "/" },
			{ label: "Change password", link: "/" },
			{ label: "Settings", link: "/" },
			{ label: "Contacts", link: "/" },
		],
	},
];

export function NavbarNested() {
	const links = mockdata.map((item) => (
		<LinksGroup {...item} key={item.label} />
	));

	return (
		<nav className={classes.navbar}>
			<div className={classes.header}>
				<Group justify="space-between">
					<Code fw={700}>WELCOME TO STAFF WORKSPACE!</Code>
				</Group>
			</div>

			<ScrollArea className={classes.links}>
				<div className={classes.linksInner}>{links}</div>
			</ScrollArea>

			<div className={classes.footer}>
				<UserButton />
			</div>
		</nav>
	);
}
