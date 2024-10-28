import React, { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser } from "@/lib/appwrite";

// import { getCurrentUser } from "../lib/appwrite";

export type GlobalContextType = {
  isLogged: boolean;
  setIsLogged: (value: boolean) => void;
  user: any;
  setUser: (value: any) => void;
  loading: boolean;
};

const GlobalContext = createContext({} as GlobalContextType);
export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLogged, setIsLogged] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const getLoggedInUser = async () => {
    getCurrentUser()
      .then((res) => {
        if (res) {
          console.log("res", res);
          setIsLogged(true);
          // @ts-ignore
          setUser(res);
        } else {
          setIsLogged(false);
          setUser(null);
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getLoggedInUser();
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        isLogged,
        setIsLogged,
        user,
        setUser,
        loading,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;