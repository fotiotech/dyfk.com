import React, { FC, ReactNode } from "react";
import Link from "next/link";

interface CheckoutProps {
  width?: string;
  height?: string;
  bgColor?: string;
  textColor?: string;
  children: ReactNode;
}

const CheckoutButton: FC<CheckoutProps> = ({
  width,
  height,
  bgColor,
  textColor,
  children,
}) => {
  return (
    <button
      title="Check Out"
      type="button"
      className={` w-${width} h-${height} bg-${bgColor} text-${textColor} 
      mx-auto rounded-lg bg-[#00002a] shadow-lg text-pri font-semibold`}
    >
      <Link href={"/checkout"} className="container">
        {children}
      </Link>
    </button>
  );
};

export default CheckoutButton;
