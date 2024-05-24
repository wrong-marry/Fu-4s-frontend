import { Outlet } from "react-router-dom";

import { Footer } from "../component/layout/Footer/Footer";
import { AppShell } from "@mantine/core";
import Navbar from "../component/navbar/Navbar";

export default function Root() {
  return (
    <AppShell>
      <Navbar />
      <main className="mt-10">
        <Outlet />
      </main>
      <Footer />
    </AppShell>
  );
}
