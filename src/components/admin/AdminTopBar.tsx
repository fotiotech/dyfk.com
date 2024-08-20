import { Menu } from "@mui/icons-material";
import Image from "next/image";
import Link from "next/link";
import React, { LegacyRef } from "react";

interface adminTopBarProps {
  domNode?: LegacyRef<HTMLDivElement>;
  sideBarToggle: boolean;
  screenSize: number;
  setSideBarToggle: (param: (arg: boolean) => boolean) => void;
}

const AdminTopBar = ({
  domNode,
  sideBarToggle,
  screenSize,
  setSideBarToggle,
}: adminTopBarProps) => {
  return (
    <div className="p-2 shadow">
      <div className="flex items-center gap-3 ">
        <div className={`${screenSize >= 1024 ? "invisible" : ""} `}>
          <span
            onClick={() => setSideBarToggle((sideBarToggle) => !sideBarToggle)}
            className=" "
          >
            <Menu />
          </span>
        </div>
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
    </div>
  );
};

export default AdminTopBar;
