"use client";
import { getUser } from "@/app/lib/dal";
import { Users } from "@/constant/types";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

// Define the type for the user data

// Define the shape of the context
interface UserContextType {
  user: Users | null;
  loading: boolean;
  error: string | null;
}

// Create the context with default values
const UserContext = createContext<UserContextType | undefined>(undefined);

// Custom hook for consuming the context
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

// Props type for the provider
interface UserProviderProps {
  children: ReactNode;
}

// UserContextProvider component
export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<Users | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getUser();
        if(userData) {
          setUser(userData ?? null);
        }
        
      } catch (err) {
        setError("Failed to fetch user");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, loading, error }}>
      {children}
    </UserContext.Provider>
  );
};
