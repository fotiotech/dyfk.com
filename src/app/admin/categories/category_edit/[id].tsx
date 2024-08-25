import { useRouter } from "next/router";
import React from "react";

const CategoryEdit = () => {
  const { id } = useRouter().query;
  return <div>Category Edit {id}</div>;
};

export default CategoryEdit;
