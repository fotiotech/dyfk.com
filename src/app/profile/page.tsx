"use client";
import Layout from "@/components/Layout";
import React from "react";
import { useAuth } from "../auth/UserContext";
import Link from "next/link";

const Profile = () => {
  const auth = useAuth();

  if (!auth) {
    throw new Error("useAuth must be used within a UserContextProvider");
  }

  const { user } = auth;
  
  return (
    <Layout>
      <div className="p-2 font-semibold text-lg">Profile</div>
      <ul className="flex flex-col gap-2 p-2">
        <li className="p-2 rounded-lg bg-gray-300">
          Welcome <span className="font-bold">{user && user?.username}</span>
        </li>
        <li className="p-2 rounded-lg bg-gray-300">
          <Link href={"/"}>Go back to Home Page</Link>
        </li>
      </ul>
    </Layout>
  );
};

export default Profile;
