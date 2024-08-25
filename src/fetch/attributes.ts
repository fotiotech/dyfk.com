import axios from "axios";

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
