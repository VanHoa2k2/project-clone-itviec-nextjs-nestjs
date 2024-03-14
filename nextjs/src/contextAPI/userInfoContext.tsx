"use client";
import { createContext, useEffect, useState } from "react";
import { useAppSelector } from "@/app/redux/hooks";
import { callFetchUserById } from "@/config/api";
import { IUser } from "@/types/backend";

export default interface IUserInfoContext {
  userInfo: IUser | undefined;
  fetchUserInfo: () => Promise<void>;
}

const userInfoContext = createContext<IUserInfoContext>({
  userInfo: undefined,
  fetchUserInfo: async () => {},
});

const UserInfoProvider = ({ children }: any) => {
  const user = useAppSelector((state) => state?.account?.user);
  const [userInfo, setUserInfo] = useState<IUser | undefined>(undefined);

  const fetchUserInfo = async () => {
    const res = await callFetchUserById(user?.id);
    setUserInfo(res.data);
  };

  useEffect(() => {
    fetchUserInfo();
  }, [user]);

  const value = {
    userInfo,
    fetchUserInfo,
  };

  return (
    <userInfoContext.Provider value={value}>
      {children}
    </userInfoContext.Provider>
  );
};

export { userInfoContext, UserInfoProvider };
