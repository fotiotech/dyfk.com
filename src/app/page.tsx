import Layout from "@/components/Layout";
import Link from "next/link";

export default function Home() {
  return (
    <Layout>
      <main
        className="flex justify-center items-center 
      min-h-dvh w-full p-2"
      >
        <div className="w-1/2">
          <h2 className="font-bold text-lg">Hello there from Dylan</h2>
          <p>
            Let&apos;s{" "}
            <Link href={"/auth/sign_up"} className="text-blue-400">
              Sign Up
            </Link>{" "}
            , our powerful E-commerce platform will start growing soon.
          </p>
        </div>
      </main>
    </Layout>
  );
}
