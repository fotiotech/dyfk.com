import React, { FC } from "react";
import { MoonLoader } from "react-spinners";

export default function Spinner() {
  return (
    <div className="flex justify-center items-center w-full p-2">
      <MoonLoader color="#5C83F7" speedMultiplier={0.8} size={28} />
    </div>
  );
}
