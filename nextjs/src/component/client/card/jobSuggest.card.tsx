"use client";

import { callFetchJob, callGetJobsSuggestByCv } from "@/config/api";
import { LOCATION_LIST, convertSlug, getLocationName } from "@/config/utils";
import { IJob } from "@/types/backend";
import { EnvironmentOutlined, ThunderboltOutlined } from "@ant-design/icons";
import { Card, Col, Empty, Pagination, Row, Spin } from "antd";
import { useState, useEffect, useContext } from "react";
import { isMobile } from "react-device-detect";
import styles from "@/styles/client.module.scss";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import IResumeContext from "@/contextAPI/resumeContext";
import bgCard from "../../../../public/bg-top-emp.svg";
dayjs.extend(relativeTime);

interface IProps {
  showPagination?: boolean;
  showTitle?: boolean;
  resume: IResumeContext;
}

const JobSuggestCard = (props: IProps) => {
  dayjs.locale("vi");
  const { showPagination = false, showTitle = false, resume } = props;

  const [displayJob, setDisplayJob] = useState<IJob[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [total, setTotal] = useState(0);
  const [filter, setFilter] = useState("");
  const [sortQuery, setSortQuery] = useState("sort=-updatedAt");
  const route = useRouter();

  // const resume: IResumeContext = useContext(resumeContext);

  useEffect(() => {
    fetchJob();
  }, [current, pageSize, filter, sortQuery, resume?.currentCV]);

  const fetchJob = async () => {
    setIsLoading(true);
    let query = `current=${current}&pageSize=${pageSize}`;
    if (filter) {
      query += `&${filter}`;
    }
    if (sortQuery) {
      query += `&${sortQuery}`;
    }

    if (resume?.currentCV?.length !== 0) {
      const res = await callGetJobsSuggestByCv(query, resume?.currentCV);
      if (res && res.data) {
        setDisplayJob(res.data.result);
        setTotal(res.data.meta.total);
      }
      setIsLoading(false);
    }
  };

  const handleOnchangePage = (pagination: {
    current: number;
    pageSize: number;
  }) => {
    if (pagination && pagination.current !== current) {
      setCurrent(pagination.current);
    }
    if (pagination && pagination.pageSize !== pageSize) {
      setPageSize(pagination.pageSize);
      setCurrent(1);
    }
  };

  const handleViewDetailJob = (item: IJob) => {
    const slug = convertSlug(item.name);
    route.push(`/home/job/${slug}?id=${item.id}`);
  };

  return (
    <div className={`${styles["card-job-section"]}`}>
      <div className={`${styles["job-content"]}`}>
        <Spin spinning={isLoading} tip="Loading...">
          <Row gutter={[20, 20]}>
            {showTitle && (
              <Col span={24}>
                <div
                  className={
                    isMobile ? styles["dflex-mobile"] : styles["dflex-pc"]
                  }
                >
                  <span className={styles["title"]}>Công việc gợi ý</span>
                  {!showPagination && <Link href="job">Xem tất cả</Link>}
                </div>
              </Col>
            )}

            {displayJob?.map((item) => {
              return (
                <Col span={24} md={12} key={item.id}>
                  <Card
                    style={{
                      boxShadow: "0px 6px 32px rgba(0, 0, 0, 0.08)",
                      position: "relative",
                    }}
                    size="small"
                    title={null}
                    hoverable
                    onClick={() => handleViewDetailJob(item)}
                  >
                    <Image
                      className={styles["pg-job-card"]}
                      alt="example"
                      src={bgCard}
                      width={100}
                      height={100}
                      style={{ width: "100%", height: "100%" }}
                    />
                    <div className={styles["card-job-content"]}>
                      <div className={styles["card-job-left"]}>
                        <Image
                          style={{ width: "50px", height: "50px" }}
                          alt="example"
                          width={100}
                          height={100}
                          src={`${process.env.NEXT_PUBLIC_URL_BACKEND}/images/company/${item?.company?.logo}`}
                        />
                      </div>
                      <div className={styles["card-job-right"]}>
                        <div className={styles["job-title"]}>{item.name}</div>
                        <div className={styles["job-location"]}>
                          <EnvironmentOutlined
                            style={{ color: "#58aaab" }}
                            type="button"
                            onPointerEnterCapture={() => {}}
                            onPointerLeaveCapture={() => {}}
                          />
                          &nbsp;{getLocationName(item.location)}
                        </div>
                        <div>
                          <ThunderboltOutlined
                            style={{ color: "orange" }}
                            type="button"
                            onPointerEnterCapture={() => {}}
                            onPointerLeaveCapture={() => {}}
                          />
                          &nbsp;
                          {(item.salary + "")?.replace(
                            /\B(?=(\d{3})+(?!\d))/g,
                            ","
                          )}{" "}
                          đ
                        </div>
                        <div className={styles["job-updatedAt"]}>
                          {dayjs(item.updatedAt).fromNow()}
                        </div>
                      </div>
                    </div>
                  </Card>
                </Col>
              );
            })}

            {(!displayJob || (displayJob && displayJob.length === 0)) &&
              !isLoading && (
                <div className={styles["empty"]}>
                  <Empty description="Không có dữ liệu" />
                </div>
              )}
          </Row>
          {showPagination && (
            <>
              <div style={{ marginTop: 30 }}></div>
              <Row style={{ display: "flex", justifyContent: "center" }}>
                <Pagination
                  current={current}
                  total={total}
                  pageSize={pageSize}
                  responsive
                  onChange={(p: number, s: number) =>
                    handleOnchangePage({ current: p, pageSize: s })
                  }
                />
              </Row>
            </>
          )}
        </Spin>
      </div>
    </div>
  );
};

export default JobSuggestCard;
