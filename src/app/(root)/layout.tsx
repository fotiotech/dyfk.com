import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Suspense } from "react";
import Loading from "../loading";
import { DefaultSeo } from "next-seo";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col ">
      <DefaultSeo
        titleTemplate="%s | dyfkCameroun.com"
        defaultTitle="dyfkCameroun.com - Your Trusted E-Commerce Platform in Cameroun"
        description="Discover the best products at unbeatable prices on dyfkCameroun.com. Shop now for a seamless online shopping experience."
        canonical="https://dyfk-com.vercel.app"
        openGraph={{
          type: "website",
          locale: "en_US",
          url: "https://dyfk-com.vercel.app",
          siteName: "dyfkCameroun.com",
          images: [
            {
              url: "https://dyfk-com.vercel.app/logo.png",
              width: 1200,
              height: 630,
              alt: "dyfkCameroun.com - Your Trusted E-Commerce Platform in Cameroun",
            },
          ],
        }}
        twitter={{
          handle: "@dyfkCameroun",
          site: "@dyfkCameroun",
          cardType: "summary_large_image",
        }}
      />
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
