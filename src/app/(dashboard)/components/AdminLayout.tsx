"use client";

import React, { ReactNode, useState } from "react";
import AdminSideBar from "./AdminSideBar";
import AdminTopBar from "./AdminTopBar";
import useClickOutside, { useScreenSize } from "@/components/Hooks";

interface adminLayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: adminLayoutProps) => {
  const [sideBarToggle, setSideBarToggle] = useState(false);
  const [screenSize, setScreenSize] = useState(0);

  const domNode = useClickOutside(() => {
    setSideBarToggle(false);
  });

  useScreenSize(() => {
    setScreenSize(window.innerWidth);
  });

  return (
    <div className="flex w-full">
      <AdminSideBar
        domNode={domNode}
        sideBarToggle={sideBarToggle}
        setSideBarToggle={setSideBarToggle}
        screenSize={screenSize}
      />

      <div
        className="flex-1 bg-[#eee] dark:bg-pri-dark
         text-sec dark:text-pri"
      >
        <AdminTopBar
          domNode={domNode}
          sideBarToggle={sideBarToggle}
          setSideBarToggle={setSideBarToggle}
          screenSize={screenSize}
        />

        <div
          className="  p-2 bg-[#eee] dark:bg-sec-dark
         text-sec dark:text-pri "
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
