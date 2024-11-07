import { AdminLayout } from "@/app/(dashboard)/components";
import Link from "next/link";
import React from "react";

const Settings = () => {
  return (
    <AdminLayout>
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
    </AdminLayout>
  );
};

export default Settings;
