"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { ICompany } from "@/types/backend";
import { callFetchCompanyById } from "@/config/api";
import styles from "@/styles/client.module.scss";
import parse from "html-react-parser";
import { Col, Divider, Row, Skeleton } from "antd";
import { EnvironmentOutlined } from "@ant-design/icons";
import Image from "next/image";
import JobByCompany from "@/component/client/card/jobByCompany.card";

const ClientCompanyDetailPage = (props: any) => {
  const [companyDetail, setCompanyDetail] = useState<ICompany | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  let params = useSearchParams();
  const id = params?.get("id"); // company id

  useEffect(() => {
    const init = async () => {
      if (id) {
        setIsLoading(true);
        const res = await callFetchCompanyById(id as unknown as number);
        if (res?.data) {
          setCompanyDetail(res.data);
        }
        setIsLoading(false);
      }
    };
    init();
  }, [id]);

  return (
    <div className={`${styles["container"]} ${styles["detail-job-section"]}`}>
      {isLoading ? (
        <Skeleton />
      ) : (
        <Row gutter={[20, 20]}>
          {companyDetail && companyDetail.id && (
            <>
              <Col span={24} md={16}>
                <div className={styles["content-job-section"]}>
                  <div className={styles["header-company-section"]}>
                    <Image
                      alt="example"
                      src={`${process.env.NEXT_PUBLIC_URL_BACKEND}/images/company/${companyDetail?.logo}`}
                      width={100}
                      height={100}
                      style={{ width: "90px", height: "90px" }}
                    />

                    <div className={styles["title"]}>
                      <div className={styles["header"]}>
                        {companyDetail.name}
                      </div>

                      <div className={styles["location"]}>
                        <EnvironmentOutlined
                          style={{ color: "#58aaab" }}
                          type="button"
                          onPointerEnterCapture={() => {}}
                          onPointerLeaveCapture={() => {}}
                        />
                        &nbsp;{companyDetail?.address}
                      </div>
                    </div>
                  </div>

                  <Divider />
                  {parse(companyDetail?.description ?? "")}
                </div>
              </Col>

              <Col span={24} md={8}>
                <JobByCompany companyId={companyDetail.id} />
              </Col>
            </>
          )}
        </Row>
      )}
    </div>
  );
};
export default ClientCompanyDetailPage;
