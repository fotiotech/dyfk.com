import { useUser } from "@/app/context/UserContext";
import {
  Menu,
  NotificationAddRounded,
  NotificationsSharp,
  Person,
} from "@mui/icons-material";
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
  const { user } = useUser();
  return (
    <div
      className="flex justify-between items-center p-2 shadow mb-4
    dark:bg-pri-dark"
    >
      <div className="flex items-center gap-3 ">
        <div className={`${screenSize >= 1024 ? "invisible" : ""} `}>
          <span
            onClick={() => setSideBarToggle((sideBarToggle) => !sideBarToggle)}
            className=" "
          >
            <Menu style={{ fontSize: 30 }} />
          </span>
        </div>
        <div>
          <Link href={"/"}>
            <Image
              title="logo"
              src="/logo.png"
              width={60}
              height={40}
              alt="logo"
              className=" w-auto h-auto"
            />
          </Link>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Link href={"/admin/notifications"}>
          <NotificationsSharp />
        </Link>

        <div className="flex items-center gap-1">
          <p className="font-bold">{user?.username}</p>
          <Person style={{ fontSize: 30 }} />
        </div>
      </div>
    </div>
  );
};

export default AdminTopBar;
