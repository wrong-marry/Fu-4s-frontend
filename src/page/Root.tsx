import { Outlet, useNavigation } from "react-router-dom";
import { AppShell, Burger, Center, Flex, Grid } from "@mantine/core";
import Navbar from "../component/navbar/Navbar";
import React, { useEffect } from "react";
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
      <AppShell.Header>
        <Grid>
          <Grid.Col span={0.5}>
            <Flex align="center" justify="center">
              <Burger ml="lg" opened={opened} onClick={toggle} size="sm" />
            </Flex>
          </Grid.Col>
          <Grid.Col span={11.5} p={0}>
              <Navbar />
          </Grid.Col>
        </Grid>
      </AppShell.Header>
      <AppShell.Navbar>
        <NavbarSimple />
      </AppShell.Navbar>
      <AppShell.Main p={0}>
        <div className="mt-10">
          <Outlet />
          <Footer />
        </div>
      </AppShell.Main>
    </AppShell>
  ) as React.ReactElement;
}
