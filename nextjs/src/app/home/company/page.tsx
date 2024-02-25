import CompanyCard from "@/component/client/card/company.card";
import { Col, Row } from "antd";
import styles from "@/styles/client.module.scss";

const ClientCompanyPage = (props: any) => {
  return (
    <div
      className={styles["container"]}
      style={{ marginTop: 20, minHeight: "600px" }}
    >
      <Row gutter={[20, 20]}>
        <Col span={24}>
          <CompanyCard showPagination={true} />
        </Col>
      </Row>
    </div>
  );
};

export default ClientCompanyPage;
