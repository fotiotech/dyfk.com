import { useParams } from "next/navigation";
import React from "react";

const CategoryEdit = () => {
  const { id } = useParams();
  return <div>Category Edit {id}</div>;
};

export default CategoryEdit;
