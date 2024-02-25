"use client";

import JobCard from "@/component/client/card/job.card";
import { Col, Divider, Menu, Row, Button } from "antd";
import React, { useContext, useState } from "react";
import styles from "@/styles/client.module.scss";
import JobSuggestCard from "@/component/client/card/jobSuggest.card";
import IResumeContext, { resumeContext } from "@/contextAPI/resumeContext";
import SearchClient from "@/component/client/search.client";
import type { MenuProps } from "antd";
import ISearchJobContext, {
  searchJobContext,
} from "@/contextAPI/searchJobContext";
import { useAppSelector } from "@/app/redux/hooks";
import ManageAccount from "@/component/client/modal/manage.account";

const ClientJobPage = () => {
  const isAuthenticated = useAppSelector(
    (state) => state?.account?.isAuthenticated
  );

  const resume: IResumeContext = useContext(resumeContext);

  const items: MenuProps["items"] = [
    {
      label: "Gợi ý việc làm",
      key: "job-suggestion",
    },
    {
      label: "Tất cả việc làm",
      key: "all-job",
    },
  ];

  const searchJobBySkill: ISearchJobContext = useContext(searchJobContext);

  const [openMangeAccount, setOpenManageAccount] = useState<boolean>(false);

  const onClick: MenuProps["onClick"] = (e) => {
    searchJobBySkill.setCurrentNav(e.key);
  };

  return (
    <>
      <SearchClient />
      <div
        className={styles["container"]}
        style={{ marginTop: 20, minHeight: "300px" }}
      >
        <Row gutter={[20, 20]}>
          {isAuthenticated && (
            <Menu
              style={{
                fontSize: "16px",
                display: "flex",
                justifyContent: "center",
                width: "100%",
                background: "transparent",
                borderBottom: "none",
              }}
              onClick={onClick}
              selectedKeys={[searchJobBySkill.currentNav]}
              mode="horizontal"
              items={items}
            />
          )}
          <Divider />
          {searchJobBySkill.currentNav === "job-suggestion" ? (
            resume?.currentCV ? (
              <Col span={24}>
                <JobSuggestCard showPagination={true} resume={resume} />
              </Col>
            ) : (
              <Col span={24}>
                <div className={styles["suggest-upload"]}>
                  <h2>Upload CV để các cơ hội việc làm tự tìm đến bạn</h2>
                  <h3>Hệ thống sẽ gợi ý những công việc phù hợp nhất</h3>
                  <h3>
                    Giảm đến 50% thời gian cần thiết để tìm được một công việc
                    phù hợp
                  </h3>
                  <Button
                    type="primary"
                    size="large"
                    onClick={() => setOpenManageAccount(true)}
                  >
                    Upload CV
                  </Button>
                </div>
              </Col>
            )
          ) : (
            <Col span={24}>
              <JobCard showPagination={true} detail={false} />
            </Col>
          )}
        </Row>
      </div>
      <ManageAccount open={openMangeAccount} onClose={setOpenManageAccount} />
    </>
  );
};

export default ClientJobPage;
