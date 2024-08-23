"use client";

import Hero from "@/components/Hero";
import Layout from "@/components/Layout";
import Link from "next/link";

export default function Home() {
  return (
    <Layout>
      <main className="">
        <Hero />
        <div
          className="flex justify-center items-center 
      h-96 w-full p-2"
        >
          <div className="w-1/2 text-center">
            <h2 className="font-bold text-lg">Hello there</h2>
            <p>
              Let&apos;s{" "}
              <Link href={"/auth/sign_up"} className="text-blue-400">
                Sign Up
              </Link>
              , our powerful E-commerce platform will start growing soon.
            </p>
          </div>
        </div>
      </main>
    </Layout>
  );
}
