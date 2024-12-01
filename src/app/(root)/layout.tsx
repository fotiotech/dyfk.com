import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Suspense } from "react";
import Loading from "../loading";
import Head from "next/head";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col ">
      <Head>
        <title>
          dyfkCameroun.com - Your Trusted E-Commerce Platform in Cameroun
        </title>
        <meta
          name="description"
          content="Discover the best products at unbeatable prices on dyfkCameroun.com. Shop now for a seamless online shopping experience."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://dyfk-com.vercel.app" />

        {/* Open Graph Metadata */}
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:url" content="https://dyfk-com.vercel.app" />
        <meta property="og:site_name" content="dyfkCameroun.com" />
        <meta
          property="og:title"
          content="dyfkCameroun.com - Your Trusted E-Commerce Platform in Cameroun"
        />
        <meta
          property="og:description"
          content="Discover the best products at unbeatable prices on dyfkCameroun.com. Shop now for a seamless online shopping experience."
        />
        <meta
          property="og:image"
          content="https://dyfk-com.vercel.app/logo.png"
        />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta
          property="og:image:alt"
          content="dyfkCameroun.com - Your Trusted E-Commerce Platform in Cameroun"
        />

        {/* Twitter Metadata */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@dyfkCameroun" />
        <meta name="twitter:creator" content="@dyfkCameroun" />
        <meta
          name="twitter:title"
          content="dyfkCameroun.com - Your Trusted E-Commerce Platform in Cameroun"
        />
        <meta
          name="twitter:description"
          content="Discover the best products at unbeatable prices on dyfkCameroun.com. Shop now for a seamless online shopping experience."
        />
        <meta
          name="twitter:image"
          content="https://dyfk-com.vercel.app/logo.png"
        />
      </Head>
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
