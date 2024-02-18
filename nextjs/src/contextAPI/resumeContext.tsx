"use client";
import { createContext, useEffect, useState } from "react";
import { useAppSelector } from "@/app/redux/hooks";
import { callFetchUserById } from "@/config/api";

export default interface IResumeContext {
  currentCV: string | undefined;
  fetchUserById: () => Promise<void>;
}

const resumeContext = createContext<IResumeContext>({
  currentCV: undefined,
  fetchUserById: async () => {},
});

const ResumeProvider = ({ children }: any) => {
  const [currentCV, setCurrentCV] = useState<string | undefined>("");

  const user = useAppSelector((state) => state?.account?.user);

  const fetchUserById = async () => {
    if (user?.id) {
      const res = await callFetchUserById(user?.id);
      setCurrentCV(res?.data?.urlCV);
    }
  };

  useEffect(() => {
    fetchUserById();
  }, [user?.id, currentCV]);

  const value = {
    currentCV,
    fetchUserById,
  };

  return (
    <resumeContext.Provider value={value}>{children}</resumeContext.Provider>
  );
};

export { resumeContext, ResumeProvider };
