import axios from "axios";

export const getUsersData = async () => {
  const response = await axios.get(`http://localhost:3000/api/users`);
  if (!response) {
    throw new Error("Network response was not ok!");
  }
  return response.data.results;
};
