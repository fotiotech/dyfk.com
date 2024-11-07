import { AdminLayout } from "@/components";
import Link from "next/link";
import React from "react";

const Settings = () => {
  return (
    <>
      <div>
        <h2>Banners & Sliders</h2>
      </div>
      <div>
        <ul className="mt-4">
          <Link href={"/admin/content_management/banner_sliders/hero_content"}>
            <li className="p-2 rounded-lg bg-gray-300">Hero Content</li>
          </Link>
          
        </ul>
      </div>
    </>
  );
};

export default Settings;
