import { Outlet, useNavigation } from "react-router-dom";
import { AppShell } from "@mantine/core";
import Navbar from "../component/navbar/Navbar";
import { nprogress } from "@mantine/nprogress";
import { useEffect } from "react";
import { Footer } from "../component/layout/Footer/Footer";

export default function Root() {
  const navigation = useNavigation();

  useEffect(() => {
    if (navigation.state === "loading") {
      nprogress.start();
    } else {
      nprogress.complete();
    }
  }, [navigation.state]);
  return (
    <AppShell>
      <Navbar />
      <main className="">
        <Outlet />
      </main>
      <Footer />
    </AppShell>
  );
}
