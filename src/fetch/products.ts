import axios from "axios";

export const getNewArrival = async () => {
  const uri = process.env.NEXT_PUBLIC_API_URL;
  const response = await axios.get(`${uri}/api/products`);
  if (!response) {
    throw new Error("Network response was not ok!");
  }
  return response.data.results;
};

export const getSearch = async (search?: string) => {
  const uri = process.env.NEXT_PUBLIC_API_URL;
  const response = await axios.get(`${uri}/api/products/search/${search}`);
  if (!response) {
    throw new Error("Network response was not ok!");
  }
  return response.data.results;
};

export const getProductDetail = async (dsin: string) => {
  const uri = process.env.NEXT_PUBLIC_API_URL;
  const response = await axios.get(`${uri}/api/products/details/${dsin}`);
  if (!response) {
    throw new Error("Network response was not ok!");
  }
  return response.data.results;
};

export const postProducts = async (data: FormData) => {
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/api/products/add_product`,
    data,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
  if (!response) {
    throw new Error("Network response was not ok!");
  }
  alert(response.data.message);
  return response.data.results;
};
