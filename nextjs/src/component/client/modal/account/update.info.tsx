"use client";

import {
  ModalForm,
  ProForm,
  ProFormDigit,
  ProFormSelect,
  ProFormText,
} from "@ant-design/pro-components";
import {
  Button,
  Col,
  ConfigProvider,
  Form,
  FormProps,
  Modal,
  Row,
  Upload,
  message,
  notification,
} from "antd";
import { isMobile } from "react-device-detect";
import { useState, useEffect, useContext } from "react";
import { callUpdateUser, callUploadSingleFile } from "@/config/api";
import { IUser } from "@/types/backend";
import { useAppSelector } from "@/app/redux/hooks";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { v4 as uuidv4 } from "uuid";
import enUS from "antd/lib/locale/en_US";
import styles from "@/styles/client.module.scss";
import IUserInfoContext, {
  userInfoContext,
} from "@/contextAPI/userInfoContext";
import Image from "next/image";

interface IAvatar {
  name: string;
  uid: string;
}

const UserUpdateInfo = (props: any) => {
  const userContext: IUserInfoContext = useContext(userInfoContext);
  const { userInfo, fetchUserInfo } = userContext;

  const [loadingUpload, setLoadingUpload] = useState<boolean>(false);
  const [dataAvatar, setDataAvatar] = useState<IAvatar[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [form] = Form.useForm();

  useEffect(() => {
    if (userInfo?.id && userInfo?.avatar) {
      const avatar = {
        name: userInfo?.avatar,
        uid: uuidv4(),
      };
      const avatarArr = [];
      avatarArr.push(avatar);
      setDataAvatar(avatarArr);
    }
  }, [userInfo]);

  const beforeUpload = (file: any) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG file!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Image must smaller than 2MB!");
    }
    return isJpgOrPng && isLt2M;
  };

  const handleChange = (info: any) => {
    if (info.file.status === "uploading") {
      setLoadingUpload(true);
    }
    if (info.file.status === "done") {
      setLoadingUpload(false);
    }
    if (info.file.status === "error") {
      setLoadingUpload(false);
      message.error(
        info?.file?.error?.event?.message ?? "Đã có lỗi xảy ra khi upload file."
      );
    }
  };

  const handleUploadFileAvatar = async ({ file, onSuccess, onError }: any) => {
    const res = await callUploadSingleFile(file, "avatar");
    if (res && res.data) {
      setDataAvatar([
        {
          name: res.data.fileName,
          uid: uuidv4(),
        },
      ]);
      if (onSuccess) onSuccess("ok");
    } else {
      if (onError) {
        setDataAvatar([]);
        const error = new Error(res.message);
        onError({ event: error });
      }
    }
  };

  const getBase64 = (img: any, callback: any) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
  };

  const handlePreview = async (file: any) => {
    if (!file.originFileObj) {
      setPreviewImage(file.url);
      setPreviewOpen(true);
      setPreviewTitle(
        file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
      );
      return;
    }

    getBase64(file.originFileObj, (url: string) => {
      setPreviewImage(url);
      setPreviewOpen(true);
      setPreviewTitle(
        file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
      );
    });
  };

  const handleReset = async () => {
    form.resetFields();
  };

  const fetchUpdateUser = async (valuesForm: any, type?: string) => {
    const { name, address, age, gender } = valuesForm;
    if (userInfo?.id) {
      //update
      const user: IUser = {
        id: userInfo.id,
        email: userInfo.email,
        name,
        age,
        gender,
        address,
        role: {
          id: userInfo.role?.id as number,
        },
        avatar: type ? type : dataAvatar[0].name,
      };

      const res = await callUpdateUser(user);
      if (res.data) {
        fetchUserInfo();
        message.success("Cập nhật thông tin thành công");
        handleReset();
      } else {
        notification.error({
          message: "Có lỗi xảy ra",
          description: res.message,
        });
      }
    }
  };

  const submitUser: any = async (valuesForm: any) => {
    fetchUpdateUser(valuesForm);
  };

  const handleRemoveFile = (file: any) => {
    setDataAvatar([]);
  };

  const onFinishFailed = async (errorInfo: any) => {
    console.log("Failed:", errorInfo);
    const type = "empty-avatar";
    fetchUpdateUser(errorInfo.values, type);
  };

  return (
    <>
      <Form
        title="Cập nhật User"
        scrollToFirstError={true}
        preserve={false}
        onFinish={submitUser}
        onFinishFailed={onFinishFailed}
        style={{ margin: "40px 60px 0" }}
        size={"large"}
        initialValues={userInfo?.id ? userInfo : {}}
        autoComplete="off"
        className={`${styles["section-update-account"]}`}
      >
        <Row gutter={16}>
          <Col lg={8} md={8} sm={24} xs={24}>
            <Form.Item
              labelCol={{ span: 24 }}
              label="Ảnh đại diện"
              name="avatar"
              rules={[
                {
                  validator: () => {
                    if (dataAvatar.length > 0) return Promise.resolve();
                    else return Promise.reject(false);
                  },
                },
              ]}
            >
              <ConfigProvider locale={enUS}>
                <Upload
                  name="avatar"
                  listType="picture-circle"
                  className="avatar-uploader"
                  maxCount={1}
                  multiple={false}
                  customRequest={handleUploadFileAvatar}
                  beforeUpload={beforeUpload}
                  onChange={handleChange}
                  onPreview={handlePreview}
                  onRemove={(file) => handleRemoveFile(file)}
                  defaultFileList={
                    userInfo?.avatar
                      ? [
                          {
                            uid: uuidv4(),
                            name: userInfo?.avatar ?? "",
                            status: "done",
                            url: `${process.env.NEXT_PUBLIC_URL_BACKEND}/images/avatar/${userInfo?.avatar}`,
                          },
                        ]
                      : []
                  }
                >
                  <div>
                    {loadingUpload ? (
                      <LoadingOutlined
                        type="button"
                        onMouseEnter={() => {}}
                        onMouseLeave={() => {}}
                      />
                    ) : (
                      <PlusOutlined
                        type="button"
                        onMouseEnter={() => {}}
                        onMouseLeave={() => {}}
                      />
                    )}
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </div>
                </Upload>
              </ConfigProvider>
            </Form.Item>
          </Col>
          <Col lg={16} md={16} sm={24} xs={24}>
            <Col lg={24} md={24} sm={24} xs={24}>
              <ProFormText
                label="Tên hiển thị"
                name="name"
                rules={[{ message: "Vui lòng không bỏ trống" }]}
                placeholder="Nhập tên hiển thị"
              />
            </Col>
            <Row gutter={16}>
              <Col lg={10} md={10} sm={24} xs={24}>
                <ProFormDigit
                  label="Tuổi"
                  name="age"
                  // rules={[{ message: "Vui lòng không bỏ trống" }]}
                  placeholder="Nhập nhập tuổi"
                />
              </Col>
              <Col lg={14} md={14} sm={24} xs={24}>
                <ProFormSelect
                  name="gender"
                  label="Giới Tính"
                  valueEnum={{
                    MALE: "Nam",
                    FEMALE: "Nữ",
                    OTHER: "Khác",
                  }}
                  placeholder="Please select a gender"
                  rules={[{ message: "Vui lòng chọn giới tính!" }]}
                />
              </Col>
            </Row>
            <Col lg={24} md={24} sm={24} xs={24}>
              <ProFormText
                label="Địa chỉ"
                name="address"
                rules={[{ message: "Vui lòng không bỏ trống" }]}
                placeholder="Nhập địa chỉ"
              />
            </Col>
          </Col>
        </Row>
        <Row justify="end">
          <Col lg={4} md={4} sm={24} xs={24}>
            <Button
              type="primary"
              htmlType="submit"
              className={`${styles["button-update-account"]}`}
            >
              Cập nhật
            </Button>
          </Col>
        </Row>
      </Form>
      <Modal
        open={previewOpen}
        title={previewTitle}
        footer={null}
        onCancel={() => setPreviewOpen(false)}
        style={{ zIndex: 1500 }}
      >
        <Image
          alt="example"
          src={previewImage}
          width={500}
          height={300}
          style={{ width: "100%", height: "100%" }}
        />
      </Modal>
    </>
  );
};

export default UserUpdateInfo;
