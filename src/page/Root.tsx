import { Outlet } from "react-router-dom";
import Header from "../component/layout/Header";
import { Footer } from "../component/layout/Footer/Footer";
import { AppShell } from "@mantine/core";

export default function Root() {
  return (
    <AppShell>
      <Header />
      <main className="mt-10">
        <Outlet />
      </main>
      <Footer />
    </AppShell>
  );
}
