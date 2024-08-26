import Layout from "@/components/Layout";
import React from "react";

const DetailsPage = ({
  params,
}: {
  params: { slug: string; dsin: string };
}) => {
  return <Layout>Details Page {params.dsin}</Layout>;
};

export default DetailsPage;
