import { useAppSelector } from "@/app/redux/hooks";
import { IJob } from "@/types/backend";
import { ProForm, ProFormText } from "@ant-design/pro-components";
import {
  Button,
  Col,
  ConfigProvider,
  Divider,
  Modal,
  Radio,
  Row,
  Space,
  Upload,
  message,
  notification,
} from "antd";
import { useRouter } from "next/navigation";
import enUS from "antd/lib/locale/en_US";
import { UploadOutlined } from "@ant-design/icons";
import type { RadioChangeEvent, UploadProps } from "antd";
import { callCreateResume, callUploadSingleFile } from "@/config/api";
import { useContext, useState } from "react";
import styles from "@/styles/client.module.scss";
interface IProps {
  isModalOpen: boolean;
  setIsModalOpen: (v: boolean) => void;
  jobDetail: IJob | null;
}
import { isMobile } from "react-device-detect";
import IResumeContext, { resumeContext } from "@/contextAPI/resumeContext";

const ApplyModal = (props: IProps) => {
  const resume: IResumeContext = useContext(resumeContext);
  const { isModalOpen, setIsModalOpen, jobDetail } = props;
  const isAuthenticated = useAppSelector(
    (state) => state.account.isAuthenticated
  );
  const user = useAppSelector((state) => state?.account?.user);
  const [urlCV, setUrlCV] = useState<string | undefined>("");

  const route = useRouter();

  const [valueCV, setValueCV] = useState<string>(
    resume.currentCV ? "current-cv" : "new-cv"
  );

  const onChange = (e: RadioChangeEvent) => {
    setValueCV(e.target.value);
  };

  const handleOkButton = async () => {
    if (valueCV === "new-cv" && !urlCV && isAuthenticated) {
      message.error("Vui lòng upload CV!");
      return;
    }

    if (!isAuthenticated) {
      setIsModalOpen(false);
      route.push(`/login?callback=${window.location.href}`);
    } else {
      if (jobDetail) {
        const res = await callCreateResume(
          valueCV === "current-cv" ? resume.currentCV : urlCV,
          jobDetail?.company?.id,
          jobDetail?.id
        );
        if (res.data) {
          message.success("Apply CV thành công!");
          setIsModalOpen(false);
        } else {
          notification.error({
            message: "Có lỗi xảy ra",
            description: res.message,
          });
        }
      }
    }
  };

  const propsUpload: UploadProps = {
    maxCount: 1,
    multiple: false,
    accept: "application/pdf,application/msword, .doc, .docx, .pdf",
    async customRequest({ file, onSuccess, onError }: any) {
      const res = await callUploadSingleFile(file, "resume");
      if (res && res.data) {
        setUrlCV(res.data.fileName);
        if (onSuccess) onSuccess("ok");
      } else {
        if (onError) {
          setUrlCV("");
          const error = new Error(res.message);
          onError({ event: error });
        }
      }
    },
    onChange(info) {
      if (info.file.status !== "uploading") {
        // console.log(info.file, info.fileList);
      }
      if (info.file.status === "done") {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === "error") {
        message.error(
          info?.file?.error?.event?.message ??
            "Đã có lỗi xảy ra khi upload file."
        );
      }
    },
  };

  return (
    <>
      <Modal
        title="Ứng Tuyển Job"
        open={isModalOpen}
        onOk={() => handleOkButton()}
        onCancel={() => setIsModalOpen(false)}
        maskClosable={false}
        okText={isAuthenticated ? "Apply CV" : "Đăng Nhập Nhanh"}
        cancelButtonProps={{ style: { display: "none" } }}
        destroyOnClose={true}
        width={isMobile ? "100%" : "600px"}
      >
        <Divider />
        {isAuthenticated ? (
          <div>
            <ConfigProvider locale={enUS}>
              <ProForm
                submitter={{
                  render: () => <></>,
                }}
              >
                <Row gutter={[10, 10]}>
                  <Col span={24}>
                    <div>
                      Bạn đang ứng tuyển công việc <b>{jobDetail?.name} </b>tại{" "}
                      <b>{jobDetail?.company?.name}</b>
                    </div>
                  </Col>
                  <Col span={24}>
                    <ProFormText
                      fieldProps={{
                        type: "email",
                      }}
                      label="Email"
                      name={"email"}
                      labelAlign="right"
                      disabled
                      initialValue={user?.email}
                    />
                  </Col>
                  <Radio.Group onChange={onChange} value={valueCV}>
                    <Space direction="vertical">
                      {resume.currentCV && (
                        <Col span={24}>
                          <div
                            className={
                              valueCV === "current-cv"
                                ? `${styles["box-apply"]} ${styles["active"]}`
                                : `${styles["box-apply"]}`
                            }
                          >
                            <Radio value={"current-cv"}>
                              <ProForm.Item label={"Sử dụng CV hiện tại"}>
                                <a
                                  href={`${process.env.NEXT_PUBLIC_URL_BACKEND}/images/resume/${resume.currentCV}`}
                                  target="_blank"
                                >
                                  {resume.currentCV}
                                </a>
                              </ProForm.Item>
                            </Radio>
                          </div>
                        </Col>
                      )}
                      <Col span={24}>
                        <div
                          className={
                            valueCV === "new-cv"
                              ? `${styles["box-apply"]} ${styles["active"]}`
                              : `${styles["box-apply"]}`
                          }
                        >
                          <Radio value={"new-cv"}>
                            <ProForm.Item
                              label={"Upload new CV"}
                              rules={[
                                {
                                  required: true,
                                  message: "Vui lòng upload file!",
                                },
                              ]}
                            >
                              <Upload {...propsUpload}>
                                <Button icon={<UploadOutlined />}>
                                  Tải lên CV của bạn ( Hỗ trợ *.doc, *.docx,
                                  *.pdf, and &lt; 5MB )
                                </Button>
                              </Upload>
                            </ProForm.Item>
                          </Radio>
                        </div>
                      </Col>
                    </Space>
                  </Radio.Group>
                </Row>
              </ProForm>
            </ConfigProvider>
          </div>
        ) : (
          <div>
            Bạn chưa đăng nhập hệ thống. Vui lòng đăng nhập để có thể{" "}
            {"Apply CV"}
            bạn nhé -.-
          </div>
        )}
        <Divider />
      </Modal>
    </>
  );
};
export default ApplyModal;
