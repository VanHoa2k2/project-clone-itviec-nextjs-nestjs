"use client";
import { useAppSelector } from "@/app/redux/hooks";
import { Dispatch, SetStateAction, createContext, useState } from "react";

export default interface ISearchJobContext {
  skillSearch: string | undefined;
  setSkillSearch: Dispatch<SetStateAction<string | undefined>>;
  locationSearch: string | undefined;
  setLocationSearch: Dispatch<SetStateAction<string | undefined>>;
  currentNav: string;
  setCurrentNav: Dispatch<SetStateAction<string>>;
}

const searchJobContext = createContext<ISearchJobContext>({
  skillSearch: "",
  setSkillSearch: async () => {},
  locationSearch: "",
  setLocationSearch: async () => {},
  currentNav: "",
  setCurrentNav: async () => {},
});

const SearchJobProvider = ({ children }: any) => {
  const isAuthenticated = useAppSelector(
    (state) => state?.account?.isAuthenticated
  );
  const [skillSearch, setSkillSearch] = useState<string | undefined>("");
  const [locationSearch, setLocationSearch] = useState<string | undefined>("");
  let [currentNav, setCurrentNav] = useState<string>(
    !isAuthenticated ? "all-job" : "job-suggestion"
  );
  const value = {
    skillSearch,
    setSkillSearch,
    locationSearch,
    setLocationSearch,
    currentNav,
    setCurrentNav,
  };

  return (
    <searchJobContext.Provider value={value}>
      {children}
    </searchJobContext.Provider>
  );
};

export { searchJobContext, SearchJobProvider };
