"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { FC, ReactNode, useContext } from "react";
import { createContext, useState } from "react";

interface ContextProps {
  children: ReactNode;
}

const UserContext = createContext<any>(null);

const UserContextProvider: FC<ContextProps> = ({ children }) => {
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const [user, setUser] = useState(storedUser);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [isLogIn, setIsLogIn] = useState(!!token);
  const router = useRouter();

  async function loginAction(option: { email: string; password: string }) {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/users/login",
        option
      );

      const { results, token, message } = response.data;

      alert(message);
      setUser({ ...results[0] });
      localStorage.setItem("user", JSON.stringify(results[0]));
      setToken(token);
      localStorage.setItem("token", token);
      setIsLogIn(true);
      router.push("/redirect");
    } catch (e) {
      alert("Login failed");
      console.error(e);
    }
  }

  function logout() {
    setUser(null);
    setToken("");
    localStorage.removeItem("token");
    setIsLogIn(false);
    router.push("/login");
  }

  return (
    <UserContext.Provider value={{ token, user, loginAction, logout, isLogIn }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;

export function useAuth() {
  return useContext(UserContext);
}
