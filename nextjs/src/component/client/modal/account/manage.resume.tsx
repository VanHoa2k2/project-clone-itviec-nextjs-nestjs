import {
  Col,
  ConfigProvider,
  Row,
  message,
  UploadProps,
  Upload,
  Button,
} from "antd";
import { ProForm } from "@ant-design/pro-components";
import enUS from "antd/lib/locale/en_US";
import { CloudUploadOutlined, UploadOutlined } from "@ant-design/icons";
import Dragger from "antd/es/upload/Dragger";
import { callUpdateCVByUser, callUploadSingleFile } from "@/config/api";
import { useContext } from "react";
import styles from "@/styles/client.module.scss";
import { SolutionOutlined } from "@ant-design/icons";
import IResumeContext, { resumeContext } from "@/contextAPI/resumeContext";

const ManageResume = () => {
  const resume: IResumeContext = useContext(resumeContext);

  const propsUpload: UploadProps = {
    maxCount: 1,
    multiple: false,
    accept: "application/pdf,application/msword, .doc, .docx, .pdf",
    showUploadList: false,
    async customRequest({ file, onSuccess, onError }: any) {
      const resFile = await callUploadSingleFile(file, "resume");
      if (resFile && resFile.data) {
        const urlCV = resFile.data.fileName;
        if (urlCV) {
          const res = await callUpdateCVByUser(urlCV);
          if (res) {
            resume.fetchUserById();
            if (onSuccess) onSuccess("ok");
          }
        }
      } else {
        if (onError) {
          // setCurrentCV("");
          const error = new Error(resFile.message);
          onError({ event: error });
        }
      }
    },
    async onChange(info) {
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
      } else if (info.file.status === "removed") {
        const res = await callUpdateCVByUser("");
        if (res) message.success(`Remove file ${info.file.name} successfully`);
      }
    },
  };
  return (
    <ConfigProvider locale={enUS}>
      <ProForm
        submitter={{
          render: () => <></>,
        }}
      >
        <Row gutter={[10, 10]}>
          <Col span={24}>
            <div className={`${styles["resume-title"]}`}>
              <p>
                Bạn đã có sẵn CV của mình, chỉ cần tải CV lên, hệ thống sẽ tự
                động đề xuất những công việc IT phù hợp nhất với cv của bạn.
                Tiết kiệm thời gian, tìm việc thông minh, nắm bắt cơ hội và làm
                chủ đường đua nghề nghiệp của chính mình.
              </p>
              <h3>
                Tải CV của bạn bên dưới để có thể sử dụng xuyên suốt quá trình
                tìm việc
              </h3>
            </div>
          </Col>
          <Col span={24}>
            {!resume.currentCV ? (
              <Dragger {...propsUpload}>
                <p className="ant-upload-drag-icon">
                  <CloudUploadOutlined
                    type="button"
                    onMouseEnter={() => {}}
                    onMouseLeave={() => {}}
                  />
                </p>
                <p className="ant-upload-text">
                  Kéo CV của bạn vào đây hoặc bấm để chọn CV của bạn
                </p>
                <p className="ant-upload-text">
                  (Sử dụng tệp .doc, .docx hoặc .pdf, không chứa mật khẩu bảo vệ
                  và dưới 5MB)
                </p>
              </Dragger>
            ) : (
              <div className={`${styles["resume-section"]}`}>
                <Row justify="space-around">
                  <Col span={3}>
                    <div className={`${styles["icon-resume"]}`}>
                      <SolutionOutlined
                        type="button"
                        onMouseEnter={() => {}}
                        onMouseLeave={() => {}}
                      />
                    </div>
                  </Col>
                  <Col span={21}>
                    <h2>CV của bạn</h2>
                    <a
                      href={`${process.env.NEXT_PUBLIC_URL_BACKEND}/images/resume/${resume.currentCV}`}
                      target="_blank"
                    >
                      {resume.currentCV}
                    </a>
                    <div className={`${styles["upload-cv"]}`}>
                      <Upload {...propsUpload}>
                        <Button
                          icon={
                            <UploadOutlined
                              type="button"
                              onMouseEnter={() => {}}
                              onMouseLeave={() => {}}
                            />
                          }
                        >
                          Tải CV mới
                        </Button>
                      </Upload>
                      <p className="ant-upload-text">
                        (Sử dụng tệp .doc, .docx hoặc .pdf, không chứa mật khẩu
                        bảo vệ và dưới 5MB)
                      </p>
                    </div>
                  </Col>
                </Row>
              </div>
            )}
          </Col>
        </Row>
      </ProForm>
    </ConfigProvider>
  );
};

export default ManageResume;
