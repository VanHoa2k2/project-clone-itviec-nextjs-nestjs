"use client";

import { Modal, Tabs } from "antd";
import { isMobile } from "react-device-detect";
import type { TabsProps } from "antd";
import WorkApply from "./account/work.apply";
import JobByEmail from "./account/jobByEmail";
import ManageResume from "./account/manage.resume";

interface IProps {
  open: boolean;
  onClose: (v: boolean) => void;
}

const UserUpdateInfo = (props: any) => {
  return <div>{"//todo"}</div>;
};

const ManageAccount = (props: IProps) => {
  const { open, onClose } = props;

  const onChange = (key: string) => {
    // console.log(key);
  };

  const items: TabsProps["items"] = [
    {
      key: "manage-resume",
      label: `Quản lý CV`,
      children: <ManageResume />,
    },
    {
      key: "work-apply",
      label: `Việc làm đã ứng tuyển`,
      children: <WorkApply />,
    },
    {
      key: "email-by-skills",
      label: `Nhận Jobs qua Email`,
      children: <JobByEmail />,
    },
    {
      key: "user-update-info",
      label: `Cập nhật thông tin`,
      children: <UserUpdateInfo />,
    },
    {
      key: "user-password",
      label: `Thay đổi mật khẩu`,
      children: `//todo`,
    },
  ];

  return (
    <>
      <Modal
        title="Quản lý tài khoản"
        open={open}
        onCancel={() => onClose(false)}
        maskClosable={false}
        footer={null}
        destroyOnClose={true}
        width={isMobile ? "100%" : "1000px"}
      >
        <div style={{ minHeight: 400 }}>
          <Tabs
            defaultActiveKey="user-resume"
            items={items}
            onChange={onChange}
          />
        </div>
      </Modal>
    </>
  );
};

export default ManageAccount;
