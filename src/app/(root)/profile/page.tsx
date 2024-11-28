"use client";
import React from "react";
import Link from "next/link";
import { useUser } from "@/app/context/UserContext";
import { logout } from "@/app/lib/actions";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const Profile = () => {
  const { user } = useUser();

  return (
    <>
      <div className="flex justify-between items-center p-2 ">
        <div className="font-semibold text-lg">Profile</div>
        <div className="flex items-center gap-3">
          <LanguageSwitcher /> <p>Currency</p>
        </div>
      </div>
      <ul className="flex flex-col gap-2 p-2">
        <li className="p-2 rounded-lg bg-gray-300">
          Welcome,
          <span className="font-bold ml-1">{user?.username}</span>!
        </li>
        <Link href={"/"}>
          <li className="p-2 rounded-lg bg-gray-300">Go back to Home Page</li>
        </Link>
        <Link href={"/checkout/billing_addresses"}>
          <li className="p-2 rounded-lg bg-gray-300">Billing Addresses</li>
        </Link>
        {user?.role === "admin" ? (
          <Link href={`/admin`}>
            <li className="p-2 rounded-lg bg-gray-300">Admin Panel</li>
          </Link>
        ) : (
          ""
        )}
        <li
          onClick={() => logout(user?._id as string)}
          className="p-2 rounded-lg bg-gray-300 text-red-800 mt-10"
        >
          Log Out
        </li>
      </ul>
    </>
  );
};

export default Profile;
