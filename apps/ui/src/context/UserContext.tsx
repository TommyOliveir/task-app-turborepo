"use client";

import { IUser } from "@/types/user";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

type UserContextType = {
  user: IUser | null;
  setUser: (user: IUser) => void;
};

const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUserState] = useState<IUser>({} as IUser);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUserState(JSON.parse(storedUser));
  }, []);

  const setUser = (user: IUser) => {
    setUserState(user);
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
