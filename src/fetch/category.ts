import axios from "axios";

export const getCategory = async () => {
  const uri = process.env.NEXT_PUBLIC_API_URL;
  const response = await axios.get(`${uri}/api/category`);
  if (!response) {
    throw new Error("Network response was not ok!");
  }
  return response.data.results;
};

export const getSubcategories = async (id:number | null) => {
    const uri = process.env.NEXT_PUBLIC_API_URL;
    const response = await axios.get(`${uri}/api/category/sub/${id}`);
    if (!response) {
      throw new Error("Network response was not ok!");
    }
    return response.data.results;
  };