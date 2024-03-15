"use client";

import { callFetchJob } from "@/config/api";
import { LOCATION_LIST, convertSlug, getLocationName } from "@/config/utils";
import { IJob } from "@/types/backend";
import { EnvironmentOutlined, ThunderboltOutlined } from "@ant-design/icons";
import { Card, Col, Empty, Pagination, Row, Spin } from "antd";
import { useState, useEffect, useContext } from "react";
import { isMobile } from "react-device-detect";
import styles from "@/styles/client.module.scss";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/vi";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import bgCard from "../../../../public/bg-top-emp.svg";
import ISearchJobContext, {
  searchJobContext,
} from "@/contextAPI/searchJobContext";

dayjs.extend(relativeTime);

interface IProps {
  detail?: boolean;
  showTitle?: boolean;
  showPagination?: boolean;
}

const JobCard = (props: IProps) => {
  dayjs.locale("vi");
  const searchJobBySkill: ISearchJobContext = useContext(searchJobContext);

  const { showPagination = false, showTitle = false, detail = true } = props;
  const [displayJob, setDisplayJob] = useState<IJob[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [total, setTotal] = useState(0);
  const [filter, setFilter] = useState("");
  const [sortQuery, setSortQuery] = useState("sort=-updatedAt");
  const route = useRouter();

  useEffect(() => {
    fetchJob();
  }, [
    current,
    pageSize,
    filter,
    sortQuery,
    searchJobBySkill.skillSearch,
    searchJobBySkill.locationSearch,
  ]);

  const fetchJob = async () => {
    const skillQuery = `${
      searchJobBySkill.skillSearch
        ? `&skills=${searchJobBySkill.skillSearch}`
        : ""
    }`;
    const locationQuery = `${
      searchJobBySkill.locationSearch
        ? `&location=${searchJobBySkill.locationSearch}`
        : ""
    }`;
    setIsLoading(true);
    let query = detail
      ? `current=${current}&pageSize=${pageSize}`
      : `current=${current}&pageSize=${pageSize}${skillQuery}${locationQuery}`;
    if (filter) {
      query += `&${filter}`;
    }
    if (sortQuery) {
      query += `&${sortQuery}`;
    }

    const res = await callFetchJob(query);
    if (res && res.data) {
      setDisplayJob(res.data.result);
      setTotal(res.data.meta.total);
    }
    setIsLoading(false);
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
                  <span className={styles["title"]}>Công việc mới nhất</span>
                  {!showPagination && <Link href="home/job">Xem tất cả</Link>}
                </div>
              </Col>
            )}

            {displayJob?.map((item) => {
              return (
                <Col span={24} md={12} key={item.id}>
                  <Card
                    style={{
                      boxShadow: "0px 6px 32px rgba(0, 0, 0, 0.08)",
                      background:
                        "linear-gradient(167deg, #f8f8f8 2.38%, #fff 70.43%)",
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
                            onMouseEnter={() => {}}
                            onMouseLeave={() => {}}
                          />
                          &nbsp;{getLocationName(item.location)}
                        </div>
                        <div>
                          <ThunderboltOutlined
                            style={{ color: "orange" }}
                            type="button"
                            onMouseEnter={() => {}}
                            onMouseLeave={() => {}}
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

export default JobCard;
