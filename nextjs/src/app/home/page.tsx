"use client";

import { Divider } from "antd";
import styles from "@/styles/client.module.scss";
import JobCard from "@/component/client/card/job.card";
import CompanyCard from "@/component/client/card/company.card";
import SearchClient from "@/component/client/search.client";
import { useState } from "react";

const HomePage = () => {
  return (
    <>
      <SearchClient />
      <div className={`${styles["container"]} ${styles["home-section"]}`}>
        <Divider />
        <CompanyCard />
        <div style={{ margin: 50 }}></div>
        <Divider />
        <JobCard />
      </div>
    </>
  );
};

export default HomePage;
