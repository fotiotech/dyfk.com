import React, { useState } from "react";
import useClickOusite, { useScreenSize } from "./Hooks";
import Link from "next/link";

interface filterListProps {
  openClose: boolean;
  setOpenClose: (arg: boolean) => void;
}

const ListFilter = ({ openClose, setOpenClose }: filterListProps) => {
  const [screenSize, setScreenSize] = useState(0);

  useScreenSize(() => {
    setScreenSize(window.innerWidth);
  });

  const domNode = useClickOusite(() => setOpenClose(false));

  return (
    <div
      ref={domNode}
      className={`${
        screenSize <= 1024
          ? openClose
            ? "absolute z-10 bottom-0"
            : "absolute -bottom-full "
          : ""
      } w-full lg:w-60  rounded-t-xl lg:rounded-none bg-pri p-2 pb-8 border-thi lg:border-none border-4 transition-all`}
    >
      <div>
        <h3 className="font-semibold text-lg">Filter List</h3>
      </div>
      <div className="w-full h-full overflow-y-auto ">
        <div>
          <h3 className=" font-bold text-lg">Category :</h3>
          <ul className=" pl-20 font-medium list-disc ">
            <Link href={"/search?category=electronic"}>
              <li className="">Electronic</li>
            </Link>
            <Link href={"/search?category=books"}>
              <li>Books</li>
            </Link>
            <Link href={"/search?category=shopping"}>
              <li>Shopping</li>
            </Link>
            <Link href={"/search?category=construction"}>
              <li>Construction</li>
            </Link>
            <Link href={"/search?category=furniture"}>
              <li>Furniture</li>
            </Link>
          </ul>
        </div>
        <div>
          <h3 className=" font-bold text-lg">Departement :</h3>
          <ul className=" lg:pl-20 font-medium list-disc">
            <li>Laptop</li>
            <li>Tablette</li>
            <li>Smartphone</li>
          </ul>
        </div>
      </div>
      <div className="w-full h-full overflow-y-auto ">
        <div>
          <h3 className=" font-bold text-lg">Category :</h3>
          <ul className=" pl-20 font-medium list-disc ">
            <Link href={"/search?category=electronic"}>
              <li className="">Electronic</li>
            </Link>
            <Link href={"/search?category=books"}>
              <li>Books</li>
            </Link>
            <Link href={"/search?category=shopping"}>
              <li>Shopping</li>
            </Link>
            <Link href={"/search?category=construction"}>
              <li>Construction</li>
            </Link>
            <Link href={"/search?category=furniture"}>
              <li>Furniture</li>
            </Link>
          </ul>
        </div>
        <div>
          <h3 className=" font-bold text-lg">Departement :</h3>
          <ul className=" lg:pl-20 font-medium list-disc">
            <li>Laptop</li>
            <li>Tablette</li>
            <li>Smartphone</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ListFilter;
