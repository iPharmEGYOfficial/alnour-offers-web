import { Outlet } from "react-router-dom";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";

export default function MainLayout() {
  return (
    <>
      <Header />

      <main className="container" style={{ minHeight: "70vh", paddingTop: 16 }}>
        <Outlet />
      </main>

      <Footer />
    </>
  );
}
