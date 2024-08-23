import axios from "axios";

export const getHeroContent = async () => {
  const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api`);
  if (!response) {
    throw new Error("Network response was not ok!");
  }
  return response.data.results;
};

export const postHeroContent = async (data: FormData) => {
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/api`,
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
