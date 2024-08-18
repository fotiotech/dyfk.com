"use client";
import { Users } from "@/constant/types";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { FC, ReactNode, useContext, useEffect } from "react";
import { createContext, useState } from "react";

interface ContextProps {
  children: ReactNode;
}

interface providerProps {
  token: string;
  user: Users | null;
  setUser: React.Dispatch<React.SetStateAction<Users | null>>;
  loginAction: (option: { email: string; password: string }) => Promise<void>;
  logout: () => void;
  isLogIn: boolean;
}

const UserContext = createContext<providerProps | null>(null);

const UserContextProvider: FC<ContextProps> = ({ children }) => {
  const [user, setUser] = useState<Users | null>(null);
  const [token, setToken] = useState("");
  const [isLogIn, setIsLogIn] = useState(!!token);
  const router = useRouter();

  useEffect(() => {
    // Ensure this code runs only on the client side
    if (typeof window !== "undefined") {
      const users = JSON.parse(localStorage.getItem("user") || "{}");
      setUser(users);
      const tok = localStorage.getItem("token") || "";
      setToken(tok);
    }
  }, []);

  async function loginAction(option: { email: string; password: string }) {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/users/login",
        option
      );

      // if (response) {

      const { token, result, message } = response.data;
      console.log(result);
      alert(message);
      setUser({ ...result });
      localStorage.setItem("user", JSON.stringify(result));
      setToken(token);
      localStorage.setItem("token", token);
      setIsLogIn(true);
      router.push("/profile");
      // }
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
    <UserContext.Provider
      value={{ token, user, setUser, loginAction, logout, isLogIn }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;

export function useAuth() {
  return useContext(UserContext);
}
