import Link from "next/link";
import React from "react";

const Inventory = () => {
  return (
    <div>
      Inventory{" "}
      <div>
        <Link
          href={"/admin/products/add_product/variants"}
          className="bg-blue-500 text-white p-2 rounded"
        >
          Back
        </Link>
        <Link
          href={"/admin/products/add_product/additional"}
          className="bg-blue-500 text-white p-2 rounded"
        >
          Next
        </Link>
      </div>
    </div>
  );
};

export default Inventory;
