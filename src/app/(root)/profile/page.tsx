"use client";
import React from "react";
import Link from "next/link";
import { logout } from "@/app/actions/auth";
import { useUser } from "@/app/context/UserContext";

const Profile = () => {
  const { user } = useUser();

  return (
    <>
      <div className="p-2 font-semibold text-lg">Profile</div>
      <ul className="flex flex-col gap-2 p-2">
        <li className="p-2 rounded-lg bg-gray-300">
          Welcome,
          <span className="font-bold ml-1">{user?.username}</span>!
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
        <li
          onClick={() => logout()}
          className="p-2 rounded-lg bg-gray-300 text-red-800"
        >
          Log Out
        </li>
      </ul>
    </>
  );
};

export default Profile;
