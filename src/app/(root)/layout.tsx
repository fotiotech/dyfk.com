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
    <html lang="en">
      <body >
        <div className=" flex flex-col">
          <Header />
          <Suspense fallback={<Loading />}>
            <div className="flex-1">{children}</div>
          </Suspense>
          <Footer />
        </div>
      </body>
    </html>
  );
}
