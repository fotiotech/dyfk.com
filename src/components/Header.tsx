"use client";
import React, { useState } from "react";
import {
  Menu,
  NavigateNext,
  Person,
  Search,
  ShoppingCart,
} from "@mui/icons-material";
import Image from "next/image";
import Link from "next/link";
import useClickOusite from "./Hooks";
import { Category } from "@/constant/types";
import { getCategory } from "@/fetch/category";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "@/app/context/UserContext";
import { useCart } from "@/app/context/CartContext";

const Header = () => {
  const { user } = useUser();
  const { cart } = useCart();
  const [showSearchBox, setShowSearchBox] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const { data: category, isLoading } = useQuery<Category[]>({
    queryKey: ["category"],
    queryFn: getCategory,
  });

  const domNode = useClickOusite(() => setShowSearchBox(false));

  return (
    <div className="p-2 bg-sec text-pri">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Menu style={{ fontSize: 30 }} />
          <Link href={"/"}>
            <Image src={"/logo.png"} width={60} height={30} alt="logo" />
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <span className={`${showSearchBox ? "hidden" : ""}`}>
            <Search
              onClick={() =>
                setShowSearchBox((showSearchBox) => !showSearchBox)
              }
            />
          </span>
          <div className="flex items-center">
            {user ? (
              <Link href={"/profile"}>
                <p className=" ">{user?.username}</p>
              </Link>
            ) : (
              <Link href={"/auth/login"}>
                <p className=" ">Login</p>
              </Link>
            )}

            <span>
              <NavigateNext style={{ fontSize: 16 }} />
            </span>

            <Link href={"/profile"}>
              <Person style={{ fontSize: 30 }} />
            </Link>
          </div>

          <span className="relative">
            {cart.length > 0 ? (
              <p
                className="absolute right-0 -top-2
              bg-red-500 text-sm rounded-full px-1"
              >
                {cart.length}
              </p>
            ) : (
              ""
            )}
            <Link href={"/cart"}>
              <ShoppingCart style={{ fontSize: 30 }} />
            </Link>
          </span>
        </div>
      </div>
      <div
        ref={domNode}
        className={`${
          showSearchBox ? "w-full h-auto mt-2" : "w-0 h-0 overflow-hidden"
        } transition-all `}
      >
        <div className="relative w-full ">
          <form
            className="flex items-center border-2
          border-thiR h-11 shadow bg-pri bg-opacity-95 rounded-xl overflow-hidden"
          >
            <input
              title="search"
              type="text"
              name="searchInput"
              value={searchInput}
              placeholder="Search Dyfk"
              onChange={(e) => setSearchInput(e.target.value)}
              onFocus={() => setShowSearchBox(true)}
              className="flex-1 h-full bg-none py-2 focus:outline-none 
                 border-none font-bold px-3 leading-tight text-sec
              "
            />
            <Link
              href={`/search?query=${searchInput}`}
              className="absolute right-0"
            >
              <button
                type="submit"
                title="Show search box"
                className=" py-1 px-3 m-1 rounded-xl bg-sec"
              >
                <Search style={{ color: "#fff" }} />
              </button>
            </Link>
          </form>
        </div>
      </div>
      <div>
        <ul className="whitespace-nowrap overflow-auto scrollbar-none">
          {category &&
            category.map((cat, index) => (
              <li key={index} className="inline-block pt-2 px-2">
                {cat.categoryName}
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default Header;
