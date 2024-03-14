import { useAppSelector } from "@/app/redux/hooks";
import { SKILLS_LIST } from "@/config/utils";
import { MonitorOutlined } from "@ant-design/icons";
import { Button, Col, Form, Row, Select } from "antd";

const JobByEmail = (props: any) => {
  const [form] = Form.useForm();
  const user = useAppSelector((state) => state?.account?.user);

  //   useEffect(() => {
  //     const init = async () => {
  //       const res = await callGetSubscriberSkills();
  //       if (res && res.data) {
  //         form.setFieldValue("skills", res.data.skills);
  //       }
  //     };
  //     init();
  //   }, []);

  //   const onFinish = async (values: any) => {
  //     const { skills } = values;
  //     const res = await callUpdateSubscriber({
  //       email: user.email,
  //       name: user.name,
  //       skills: skills ? skills : [],
  //     });
  //     if (res.data) {
  //       message.success("Cập nhật thông tin thành công");
  //     } else {
  //       notification.error({
  //         message: "Có lỗi xảy ra",
  //         description: res.message,
  //       });
  //     }
  //   };

  return (
    <>
      <Form
        //    onFinish={onFinish}
        form={form}
      >
        <Row gutter={[20, 20]}>
          <Col span={24}>
            <Form.Item
              label={"Kỹ năng"}
              name={"skills"}
              rules={[
                { required: true, message: "Vui lòng chọn ít nhất 1 skill!" },
              ]}
            >
              <Select
                mode="multiple"
                allowClear
                showArrow={false}
                style={{ width: "100%" }}
                placeholder={
                  <>
                    <MonitorOutlined
                      type="button"
                      onPointerEnterCapture={() => {}}
                      onPointerLeaveCapture={() => {}}
                    />{" "}
                    Tìm theo kỹ năng...
                  </>
                }
                optionLabelProp="label"
                options={SKILLS_LIST}
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Button onClick={() => form.submit()}>Cập nhật</Button>
          </Col>
        </Row>
      </Form>
    </>
  );
};

export default JobByEmail;
