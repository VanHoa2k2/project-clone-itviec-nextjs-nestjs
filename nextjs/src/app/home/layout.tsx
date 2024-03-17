"use client";

import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { fetchAccount } from "../redux/slice/accountSlide";
import { usePathname } from "next/navigation";
import Header from "@/component/client/header.client";
import styles from "@/styles/app.module.scss";
import { ResumeProvider } from "@/contextAPI/resumeContext";
import Footer from "@/component/client/footer.client";
import { SearchJobProvider } from "@/contextAPI/searchJobContext";
import { UserInfoProvider } from "@/contextAPI/userInfoContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const pathname = usePathname();
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (rootRef && rootRef.current) {
      rootRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [pathname]);

  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(fetchAccount());
  }, [dispatch]);

  return (
    <ResumeProvider>
      <UserInfoProvider>
        <div className={styles["layout-app"]} ref={rootRef}>
          <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          <div className={styles["content-app"]}>
            <SearchJobProvider>{children}</SearchJobProvider>
          </div>
          <Footer />
        </div>
      </UserInfoProvider>
    </ResumeProvider>
  );
}
