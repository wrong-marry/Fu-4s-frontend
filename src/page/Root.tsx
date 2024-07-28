import {Outlet, useLocation, useNavigation} from "react-router-dom";
import {AppShell} from "@mantine/core";
import Navbar from "../component/navbar/Navbar";
import React, {useEffect} from "react";
import {nprogress} from "@mantine/nprogress";

import {Footer} from "../component/layout/Footer/Footer";
import {NavbarSimple} from "../component/navbar/Sidebar/NavbarSimple";
import {useDisclosure} from "@mantine/hooks";

export default function Root() {
    const navigation = useNavigation();
    const location = useLocation();
    const isLandingPage = location.pathname === '/';
    const [opened, {toggle}] = useDisclosure();
    useEffect(() => {
        if (navigation.state === "loading") {
            nprogress.start();
        } else {
            nprogress.complete();
        }
    }, [navigation.state]);
    const handleClickBurger = () => {
        toggle();
    };
    return (
        <AppShell
            header={{height: {base: 120, sm: 65}}}
            navbar={{
                width: 250,
                breakpoint: "sm",
                collapsed: {mobile: !opened, desktop: opened},
            }}
            padding="md"
        >
            <AppShell.Header py='xs'>
                <Navbar isLandingPage={isLandingPage} opened={opened} setOpened={handleClickBurger}/>
            </AppShell.Header>
            <AppShell.Navbar display={isLandingPage ? "none" : "block"}>
                <NavbarSimple/>
            </AppShell.Navbar>
            <AppShell.Main className={isLandingPage ? "p-0" : ""}>
                <div className="mt-10">
                    <Outlet/>
                    <Footer/>
                </div>
            </AppShell.Main>
        </AppShell>
    ) as React.ReactElement;
}
