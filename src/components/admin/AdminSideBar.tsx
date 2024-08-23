import Image from "next/image";
import Link from "next/link";
import React, { LegacyRef } from "react";

interface adminSideBarProps {
  domNode?: LegacyRef<HTMLDivElement>;
  sideBarToggle: boolean;
  screenSize: number;
  setSideBarToggle: (arg: boolean) => void;
}

const AdminSideBar = ({
  domNode,
  sideBarToggle,
  screenSize,
  setSideBarToggle,
}: adminSideBarProps) => {
  const open = "absolute z-10 left-0 ";
  const hide = " absolute -left-full z-10";

  const handleCloseSideBar = () => {
    if (sideBarToggle !== undefined && screenSize <= 1024) {
      setSideBarToggle(false);
    }
  };

  return (
    <div
      ref={domNode}
      className={`${
        screenSize <= 1024 ? (sideBarToggle ? open : hide) : ""
      } w-48 h-screen shadow overflow-auto bg-pri`}
    >
      <div className="p-2">
        <Link href={"/"}>
          <Image
            title="logo"
            src="/logo.png"
            width={60}
            height={30}
            alt="logo"
            className="p-2"
          />
        </Link>
      </div>
      <div>
        <ul
          className="flex flex-col gap-2 p-2 
        font-semibold text-gray-700"
        >
          <Link href={"/admin"}>
            <li onClick={handleCloseSideBar}>DashBoard</li>
          </Link>

          <Link href={"/admin/users"}>
            <li onClick={handleCloseSideBar}>Users</li>
          </Link>
          <Link href={"/admin/categories"}>
            <li onClick={handleCloseSideBar}>Categories</li>
          </Link>
          <Link href={"/admin/products"}>
            <li onClick={handleCloseSideBar}>Products</li>
          </Link>
          <Link href={"/admin/customers"}>
            <li onClick={handleCloseSideBar}>Customers</li>
          </Link>
          <Link href={"/admin/settings"}>
            <li onClick={handleCloseSideBar}>Settings</li>
          </Link>
        </ul>
      </div>
    </div>
  );
};

export default AdminSideBar;
