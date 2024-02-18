"use client";

import { callFetchCompany } from "@/config/api";
import { convertSlug } from "@/config/utils";
import { ICompany } from "@/types/backend";
import { Card, Col, Divider, Empty, Pagination, Row, Spin } from "antd";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { isMobile } from "react-device-detect";
import styles from "@/styles/client.module.scss";
import bgCard from "../../../../public/bg-top-emp.svg";

interface IProps {
  showPagination?: boolean;
}

const CompanyCard = (props: IProps) => {
  const { showPagination = false } = props;

  const [displayCompany, setDisplayCompany] = useState<ICompany[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(4);
  const [total, setTotal] = useState(0);
  const [filter, setFilter] = useState("");
  const [sortQuery, setSortQuery] = useState("sort=-updatedAt");
  const route = useRouter();

  useEffect(() => {
    fetchCompany();
  }, [current, pageSize, filter, sortQuery]);

  const fetchCompany = async () => {
    setIsLoading(true);
    let query = `current=${current}&pageSize=${pageSize}`;
    if (filter) {
      query += `&${filter}`;
    }
    if (sortQuery) {
      query += `&${sortQuery}`;
    }

    const res = await callFetchCompany(query);
    if (res && res.data) {
      setDisplayCompany(res.data.result);
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

  const handleViewDetailJob = (item: ICompany) => {
    if (item.name) {
      const slug = convertSlug(item.name);
      route.push(`/home/company/${slug}?id=${item.id}`);
    }
  };

  return (
    <div className={`${styles["company-section"]}`}>
      <div className={styles["company-content"]}>
        <Spin spinning={isLoading} tip="Loading...">
          <Row gutter={[20, 20]}>
            <Col span={24}>
              <div
                className={
                  isMobile ? styles["dflex-mobile"] : styles["dflex-pc"]
                }
              >
                <span className={styles["title"]}>Nhà Tuyển Dụng Hàng Đầu</span>
                {!showPagination && <Link href="company">Xem tất cả</Link>}
              </div>
            </Col>

            {displayCompany?.map((item) => {
              return (
                <Col span={24} md={6} key={item.id}>
                  <Card
                    onClick={() => handleViewDetailJob(item)}
                    style={{
                      height: 350,
                      boxShadow: "0px 6px 32px rgba(0, 0, 0, 0.08)",
                      background:
                        "linear-gradient(167deg, #f8f8f8 2.38%, #fff 70.43%)",
                    }}
                    hoverable
                    cover={
                      <div className={styles["card-customize"]}>
                        <Image
                          className={styles["pg-company-card"]}
                          alt="example"
                          src={bgCard}
                          width={100}
                          height={100}
                          style={{ width: "100%", height: "100%" }}
                        />
                        <Image
                          alt="example"
                          src={`${process.env.NEXT_PUBLIC_URL_BACKEND}/images/company/${item?.logo}`}
                          width={100}
                          height={100}
                          style={{ width: "100%", height: "100%" }}
                        />
                      </div>
                    }
                  >
                    <Divider />
                    <h3 style={{ textAlign: "center" }}>{item.name}</h3>
                  </Card>
                </Col>
              );
            })}

            {(!displayCompany ||
              (displayCompany && displayCompany.length === 0)) &&
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

export default CompanyCard;
