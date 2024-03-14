import { Button, Col, Form, Input, Row, Select } from "antd";
import { EnvironmentOutlined, SearchOutlined } from "@ant-design/icons";
import { LOCATION_LIST, SKILLS_LIST } from "@/config/utils";
import { ProForm } from "@ant-design/pro-components";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { fetchJob } from "@/app/redux/slice/jobSlide";
import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import styles from "@/styles/client.module.scss";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import ISearchJobContext, {
  searchJobContext,
} from "@/contextAPI/searchJobContext";

const SearchClient = (props: any) => {
  const optionsSkills = SKILLS_LIST;
  const optionsLocations = LOCATION_LIST;
  const jobs = useAppSelector((state) => state.job.result);
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();
  const pathname = usePathname();
  const route = useRouter();

  const [suggestSkill, setSuggestSkill] = useState<string | undefined>(
    "ReactJS"
  );

  const searchJobBySkill: ISearchJobContext = useContext(searchJobContext);

  const searchParams = useSearchParams();
  const skill = searchParams.get("skill") as string | undefined;
  const location = searchParams.get("location") as string | undefined;

  const onFinish = async (values: any) => {
    searchJobBySkill.setCurrentNav("all-job");
    searchJobBySkill.setLocationSearch(values.location);
    searchJobBySkill.setSkillSearch(values.skill);
    if (pathname === "/home") {
      route.push(
        `/home/job${values.skill ? `?skill=${values.skill}` : ""}${
          values.location ? `?location=${values.location}` : ""
        }`
      );
    }
  };

  const handleClickSuggestSkill = () => {
    onFinish({ skill: suggestSkill });
  };

  useEffect(() => {
    dispatch(fetchJob({ query: `current=${0}&pageSize=${0}` }));
    searchJobBySkill.setLocationSearch(location);
    searchJobBySkill.setSkillSearch(skill);
  }, [skill, location]);

  return (
    <div className={styles["search-section"]}>
      <div className={styles["container"]}>
        <ProForm
          form={form}
          onFinish={onFinish}
          submitter={{
            render: () => <></>,
          }}
        >
          <Row gutter={[20, 20]}>
            <Col span={24}>
              <h2>
                {jobs.length} Việc làm IT cho Developer {'"Chất"'}
              </h2>
            </Col>
            <Col span={24} md={16}>
              <ProForm.Item name="skill">
                <Input
                  allowClear
                  style={{ width: "100%", height: "40px", fontSize: "18px" }}
                  placeholder="Tìm theo kỹ năng..."
                  defaultValue={skill && skill}
                />
              </ProForm.Item>
            </Col>
            <Col span={12} md={4}>
              <ProForm.Item name="location">
                <Select
                  allowClear
                  showArrow={false}
                  style={{ width: "100%", height: "40px", fontSize: "20px" }}
                  placeholder={
                    <>
                      <EnvironmentOutlined
                        type="button"
                        onPointerEnterCapture={() => {}}
                        onPointerLeaveCapture={() => {}}
                      />{" "}
                      Địa điểm...
                    </>
                  }
                  defaultValue={location && location}
                  optionLabelProp="label"
                  options={optionsLocations}
                />
              </ProForm.Item>
            </Col>
            <Col span={12} md={4}>
              <Button
                style={{ height: "40px", fontSize: "18px" }}
                icon={
                  <SearchOutlined
                    type="button"
                    onPointerEnterCapture={() => {}}
                    onPointerLeaveCapture={() => {}}
                  />
                }
                type="primary"
                onClick={() => form.submit()}
              >
                Tìm kiếm
              </Button>
            </Col>
            <Col span={12} md={12}>
              <div className={styles["suggest"]}>
                Gợi ý cho bạn:{" "}
                <div onClick={() => handleClickSuggestSkill()}>
                  {suggestSkill}
                </div>
              </div>
            </Col>
          </Row>
        </ProForm>
      </div>
    </div>
  );
};
export default SearchClient;
