"use client";
import { Dispatch, SetStateAction, createContext, useState } from "react";

export default interface ISearchJobContext {
  skillSearch: string | undefined;
  setSkillSearch: Dispatch<SetStateAction<string | undefined>>;
  locationSearch: string | undefined;
  setLocationSearch: Dispatch<SetStateAction<string | undefined>>;
}

const searchJobContext = createContext<ISearchJobContext>({
  skillSearch: "",
  setSkillSearch: async () => {},
  locationSearch: "",
  setLocationSearch: async () => {},
});

const SearchJobProvider = ({ children }: any) => {
  const [skillSearch, setSkillSearch] = useState<string | undefined>("");
  const [locationSearch, setLocationSearch] = useState<string | undefined>("");
  const value = {
    skillSearch,
    setSkillSearch,
    locationSearch,
    setLocationSearch,
  };

  return (
    <searchJobContext.Provider value={value}>
      {children}
    </searchJobContext.Provider>
  );
};

export { searchJobContext, SearchJobProvider };
