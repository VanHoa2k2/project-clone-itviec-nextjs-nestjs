"use client";

import JobCard from "@/component/client/card/job.card";
import { Col, Divider, Row } from "antd";
import React, { useContext, useState } from "react";
import styles from "@/styles/client.module.scss";
import JobSuggestCard from "@/component/client/card/jobSuggest.card";
import IResumeContext, { resumeContext } from "@/contextAPI/resumeContext";
import SearchClient from "@/component/client/search.client";

const ClientJobPage = () => {
  const resume: IResumeContext = useContext(resumeContext);

  return (
    <>
      <SearchClient />
      <div className={styles["container"]} style={{ marginTop: 20 }}>
        <Row gutter={[20, 20]}>
          {resume.currentCV && (
            <>
              <Divider />
              <Col span={24}>
                <JobSuggestCard showPagination={true} resume={resume} />
              </Col>
            </>
          )}
          <Divider />

          <Col span={24}>
            <JobCard showPagination={true} detail={false} />
          </Col>
        </Row>
      </div>
    </>
  );
};

export default ClientJobPage;
