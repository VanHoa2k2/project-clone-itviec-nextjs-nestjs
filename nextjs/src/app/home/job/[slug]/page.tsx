"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { ICompany, IJob } from "@/types/backend";
import { callFetchJobById } from "@/config/api";
import styles from "@/styles/client.module.scss";
import parse from "html-react-parser";
import { Col, Divider, Row, Skeleton, Tag } from "antd";
import {
  DollarOutlined,
  EnvironmentOutlined,
  HistoryOutlined,
} from "@ant-design/icons";
import { convertSlug, getLocationName } from "@/config/utils";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import ApplyModal from "@/component/client/modal/apply.modal";
import Image from "next/image";
dayjs.extend(relativeTime);

const ClientJobDetailPage = (props: any) => {
  const [jobDetail, setJobDetail] = useState<IJob | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  let params = useSearchParams();
  const id = params?.get("id"); // job id

  useEffect(() => {
    const init = async () => {
      if (id) {
        setIsLoading(true);
        const res = await callFetchJobById(id);
        if (res?.data) {
          setJobDetail(res.data);
        }
        setIsLoading(false);
      }
    };
    init();
  }, [id]);

  const route = useRouter();
  const handleViewDetailCompany = (item: ICompany) => {
    if (item.name) {
      const slug = convertSlug(item.name);
      route.push(`/home/company/${slug}?id=${item.id}`);
    }
  };

  return (
    <div className={`${styles["container"]} ${styles["detail-job-section"]}`}>
      {isLoading ? (
        <Skeleton />
      ) : (
        <Row gutter={[20, 20]}>
          {jobDetail && jobDetail.id && (
            <>
              <Col span={24} md={16}>
                <div className={styles["content-job-section"]}>
                  <div className={styles["header"]}>{jobDetail.name}</div>
                  <div>
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className={styles["btn-apply"]}
                    >
                      Ứng tuyển
                    </button>
                  </div>
                  <Divider />
                  <div className={styles["skills"]}>
                    {jobDetail?.skills?.map((item, index) => {
                      return (
                        <Tag key={`${index}-key`} color="gold">
                          {item as unknown as string}
                        </Tag>
                      );
                    })}
                  </div>
                  <div className={styles["salary"]}>
                    <DollarOutlined />
                    <span>
                      &nbsp;
                      {(jobDetail.salary + "")?.replace(
                        /\B(?=(\d{3})+(?!\d))/g,
                        ","
                      )}{" "}
                      đ
                    </span>
                  </div>
                  <div className={styles["location"]}>
                    <EnvironmentOutlined style={{ color: "#58aaab" }} />
                    &nbsp;{getLocationName(jobDetail.location)}
                  </div>
                  <div>
                    <HistoryOutlined /> {dayjs(jobDetail.updatedAt).fromNow()}
                  </div>
                  <Divider />
                  {parse(jobDetail.description)}
                </div>
              </Col>

              <Col span={24} md={8}>
                <div
                  className={styles["company"]}
                  style={{ cursor: "pointer" }}
                  onClick={() =>
                    handleViewDetailCompany(jobDetail.company as ICompany)
                  }
                >
                  <div>
                    <Image
                      alt="example"
                      src={`${process.env.NEXT_PUBLIC_URL_BACKEND}/images/company/${jobDetail?.company?.logo}`}
                      width={100}
                      height={100}
                      style={{
                        width: "100%",
                        height: "100%",
                        borderRadius: "12px",
                      }}
                    />
                  </div>
                  <div>{jobDetail.company?.name}</div>
                </div>
              </Col>
            </>
          )}
        </Row>
      )}
      <ApplyModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        jobDetail={jobDetail}
      />
    </div>
  );
};
export default ClientJobDetailPage;
