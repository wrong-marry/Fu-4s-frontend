import { Outlet } from "react-router-dom";

import { Footer } from "../component/layout/footer/Footer";
import { AppShell } from "@mantine/core";
import { Header } from "../component/layout/header/Header";

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
