import { useRouter } from "next/router";
import React from "react";

const CategoryEdit = ({ params }: { params: { id: string } }) => {
  return <div>Category Edit {params.id}</div>;
};

export default CategoryEdit;
