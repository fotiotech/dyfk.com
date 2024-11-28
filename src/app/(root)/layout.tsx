import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Suspense } from "react";
import Loading from "../loading";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col ">
      <div className="flex flex-col min-h-screen">
        <Header />
        <Suspense fallback={<Loading />}>
          <div className="flex-1">{children}</div>
        </Suspense>
      </div>
      <Footer />
    </div>
  );
}
