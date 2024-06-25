import { Outlet, useNavigation } from "react-router-dom";
import { AppShell, Burger, Center, Flex, Grid, Stack } from "@mantine/core";
import Navbar from "../component/navbar/Navbar";
import React, { useEffect, useState } from "react";
import { nprogress } from "@mantine/nprogress";

import { Footer } from "../component/layout/Footer/Footer";
import { NavbarSimple } from "../component/navbar/Sidebar/NavbarSimple";
import { useDisclosure } from "@mantine/hooks";

export default function Root() {
  const navigation = useNavigation();

  const [opened, { toggle }] = useDisclosure();
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
      header={{ height: 65 }}
      navbar={{
        width: 300,
        breakpoint: "sm",
        collapsed: { mobile: !opened, desktop: !opened },
      }}
      padding="md"
    >
      <AppShell.Header p={0}>
      <Navbar opened={opened} setOpened={handleClickBurger} />
      </AppShell.Header>
      <AppShell.Navbar>
        <NavbarSimple />
      </AppShell.Navbar>
      <AppShell.Main>
        <div className="mt-10">
          <Outlet />
          <Footer />
        </div>
      </AppShell.Main>
    </AppShell>
  ) as React.ReactElement;
}
