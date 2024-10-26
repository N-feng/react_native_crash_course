import { useEffect, useState } from "react";

import { getCurrentUser } from "../lib/appwrite";

export const useCurrentUser = () => {
  const [user, setUser] = useState(null);
  console.log('user: ', user);

  useEffect(() => {
    getCurrentUser()
      .then((res: any) => {
        if (res) {
          setUser(res);
        } else {
          setUser(null);
        }
      })
      .catch((error) => {
        console.log(error);
      })
  }, []);

  return user;
};
