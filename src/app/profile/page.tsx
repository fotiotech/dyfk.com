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

  const { user, logout } = auth;

  return (
    <Layout>
      <div className="p-2 font-semibold text-lg">Profile</div>
      <ul className="flex flex-col gap-2 p-2">
        <li className="p-2 rounded-lg bg-gray-300">
          Welcome <span className="font-bold">{user && user?.username}</span>
        </li>
        <Link href={"/"}>
          <li className="p-2 rounded-lg bg-gray-300">Go back to Home Page</li>
        </Link>
        {user?.role === "admin" ? (
          <Link href={`/admin`}>
            <li className="p-2 rounded-lg bg-gray-300">Admin Panel</li>
          </Link>
        ) : (
          ""
        )}
        <li onClick={logout} className="p-2 rounded-lg bg-gray-300">
          Log Out
        </li>
      </ul>
    </Layout>
  );
};

export default Profile;
