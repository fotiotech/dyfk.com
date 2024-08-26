import Layout from "@/components/Layout";
import { useRouter } from "next/router";
import React from "react";

const DetailsPage = () => {
  const { dsin } = useRouter().query;
  return <Layout>Details Page</Layout>;
};

export default DetailsPage;
