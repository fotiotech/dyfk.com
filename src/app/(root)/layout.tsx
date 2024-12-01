import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Suspense } from "react";
import Loading from "../loading";

export const metadata = {
  title: "dyfkCameroun.com - Your Trusted E-Commerce Platform in Cameroun",
  description:
    "Discover the best products at unbeatable prices on dyfkCameroun.com. Shop now for a seamless online shopping experience.",
  viewport: "width=device-width, initial-scale=1",
  canonical: "https://dyfk-com.vercel.app",

  // Open Graph Metadata
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://dyfk-com.vercel.app",
    siteName: "dyfkCameroun.com",
    title: "dyfkCameroun.com - Your Trusted E-Commerce Platform in Cameroun",
    description:
      "Discover the best products at unbeatable prices on dyfkCameroun.com. Shop now for a seamless online shopping experience.",
    images: [
      {
        url: "https://dyfk-com.vercel.app/logo.png",
        width: 1200,
        height: 630,
        alt: "dyfkCameroun.com - Your Trusted E-Commerce Platform in Cameroun",
      },
    ],
  },

  // Twitter Metadata
  twitter: {
    card: "summary_large_image",
    site: "@dyfkCameroun",
    creator: "@dyfkCameroun",
    title: "dyfkCameroun.com - Your Trusted E-Commerce Platform in Cameroun",
    description:
      "Discover the best products at unbeatable prices on dyfkCameroun.com. Shop now for a seamless online shopping experience.",
    image: "https://dyfk-com.vercel.app/logo.png",
  },
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col">
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
