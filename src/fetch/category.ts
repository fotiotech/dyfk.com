import axios from "axios";

export const getCategory = async () => {
  const uri = process.env.NEXT_PUBLIC_API_URL;
  const response = await axios.get(`${uri}/api/category`);
  if (!response) {
    throw new Error("Network response was not ok!");
  }
  return response.data.results;
};

export const getCategoryEdit = async (id: string) => {
  const uri = process.env.NEXT_PUBLIC_API_URL;
  const response = await axios.get(`${uri}/api/category/${id}`);
  if (!response) {
    throw new Error("Network response was not ok!");
  }
  return response.data.results;
};

export const getBrands = async () => {
  const uri = process.env.NEXT_PUBLIC_API_URL;
  const response = await axios.get(`${uri}/api/brands`);
  if (!response) {
    throw new Error("Network response was not ok!");
  }
  return response.data.results;
};

export const getSubcategories = async (id: string | null) => {
  const uri = process.env.NEXT_PUBLIC_API_URL;
  const response = await axios.get(`${uri}/api/category/sub/${id}`);
  if (!response) {
    throw new Error("Network response was not ok!");
  }
  return response.data.results;
};

export const postCategory = async () => {
  const uri = process.env.NEXT_PUBLIC_API_URL;
  const response = await axios.post(`${uri}/api/category`);
  if (!response) {
    throw new Error("Network response was not ok!");
  }
  return response.data.results;
};

export const putCategory = async (data: FormData) => {
  const uri = process.env.NEXT_PUBLIC_API_URL;
  const response = await axios.put(`${uri}/api/category`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  if (!response) {
    throw new Error("Network response was not ok!");
  }
  return response.data.results;
};

export const postBrands = async () => {
  const uri = process.env.NEXT_PUBLIC_API_URL;
  const response = await axios.post(`${uri}/api/brands`);
  if (!response) {
    throw new Error("Network response was not ok!");
  }
  return response.data.results;
};

export const putBrands = async () => {
  const uri = process.env.NEXT_PUBLIC_API_URL;
  const response = await axios.put(`${uri}/api/brands`);
  if (!response) {
    throw new Error("Network response was not ok!");
  }
  return response.data.results;
};
