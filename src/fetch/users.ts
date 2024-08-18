import axios from "axios";

export const getUsersData = async () => {
  const uri = process.env.NEXT_PUBLIC_API_URL;
  const response = await axios.get(`${uri}/api/users`);
  if (!response) {
    throw new Error("Network response was not ok!");
  }
  return response.data.results;
};
