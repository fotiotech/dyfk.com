import axios from "axios";

export const getAttributes = async () => {
  const uri = process.env.NEXT_PUBLIC_API_URL;
  const response = await axios.get(`${uri}/api/category/attributes`);
  if (!response) {
    throw new Error("Network response was not ok!");
  }
  return response.data.results;
};

export const postAttributes = async (data: FormData) => {
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/api/category/attributes`,
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
