import { AdminLayout } from "@/components";
import Link from "next/link";
import React from "react";

const Settings = () => {
  return (
    <AdminLayout>
      <div>
        <h2>Settings</h2>
      </div>
      <div>
        <ul className="mt-4">
          <Link href={"/admin/settings/hero_content"}>
            <li className="p-2 rounded-lg bg-gray-300">Hero Content</li>
          </Link>
          
        </ul>
      </div>
    </AdminLayout>
  );
};

export default Settings;
