import { Menu, Person, Search, ShoppingCart } from "@mui/icons-material";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Header = () => {
  return (
    <div className="p-2 bg-sec text-pri">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Menu />
          <Image src={"/logo.png"} width={60} height={30} alt="logo" />
        </div>
        <div className="flex items-center gap-2">
          <span>
            <Search />
          </span>
          <Link href={"/auth/login"} className="font-medium">
            Login
          </Link>
          <span>
            <Person />
          </span>
          <span>
            <ShoppingCart />
          </span>
        </div>
      </div>
    </div>
  );
};

export default Header;
