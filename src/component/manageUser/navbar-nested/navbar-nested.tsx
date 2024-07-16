import {Code, Group, ScrollArea} from "@mantine/core";
import {
    IconGauge,
    IconLock,
    IconPresentationAnalytics,
} from "@tabler/icons-react";
import {UserButton} from "../user-button/UserButton.tsx";
import {LinksGroup} from "../navbar-linksgroup/NavbarLinksGroup.tsx";
import classes from "./NavbarNested.module.css";

const mockdata = [
    {
        label: "Dashboard",
        icon: IconGauge,
        initiallyOpened: true,
        links: [
            {label: "Overview", link: "/"}, // cho xem cac hoat dong cua cac trang khac manage va staff
            {label: "Calendar", link: "/admin/calendar"},
            {label: "Manage Users", link: "/"},
            {label: "Manage Subjects", link: "/"},
        ],
    },
    {
        label: "Manage Staffs",
        icon: IconGauge,
        links: [
            {label: "Staff Monitoring", link: "/"},
            {label: "Pending Posts", link: "/"},
            {label: "Pending Comments", link: "/"},
        ],
    },
    {label: "Analytics", icon: IconPresentationAnalytics},

    {
        label: "Settings",
        icon: IconLock,
        links: [
            {label: "Enable 2FA", link: "/"},
            {label: "Settings", link: "/"},
            {label: "Change password", link: "/"},
            {label: "Recovery codes", link: "/"},
        ],
    },
];

export function NavbarNested() {
    const links = mockdata.map((item) => (
        <LinksGroup {...item} key={item.label}/>
    ));

    return (
        <nav className={classes.navbar}>
            <div className={classes.header}>
                <Group justify="space-between">
                    <Code fw={700}>WELCOME TO ADMIN WORKSPACE!</Code>
                </Group>
            </div>

            <ScrollArea className={classes.links}>
                <div className={classes.linksInner}>{links}</div>
            </ScrollArea>

            <div className={classes.footer}>
                <UserButton/>
            </div>
        </nav>
    );
}
