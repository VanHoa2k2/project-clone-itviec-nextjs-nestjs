"use client";

import { useState, useEffect, useContext } from "react";
import {
  CodeOutlined,
  ContactsOutlined,
  DashOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  RiseOutlined,
  TwitterOutlined,
  SolutionOutlined,
} from "@ant-design/icons";
import { Avatar, Drawer, Dropdown, MenuProps, Space, message } from "antd";
import { Menu, ConfigProvider } from "antd";
import styles from "@/styles/client.module.scss";
// import { isMobile } from "react-device-detect";
import { FaReact } from "react-icons/fa";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { callFetchUserById, callLogout } from "@/config/api";
import { setLogoutAction } from "@/app/redux/slice/accountSlide";
import ManageAccount from "./modal/manage.account";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import Link from "next/link";
import logoItViec from "../../../public/logo-itviec.png";
import Image from "next/image";
import ISearchJobContext, {
  searchJobContext,
} from "@/contextAPI/searchJobContext";
import { IUser } from "@/types/backend";
import IUserInfoContext, {
  userInfoContext,
} from "@/contextAPI/userInfoContext";

const Header = (props: any) => {
  const route = useRouter();
  const dispatch = useAppDispatch();

  const isAuthenticated = useAppSelector(
    (state) => state?.account?.isAuthenticated
  );
  const userContext: IUserInfoContext = useContext(userInfoContext);
  const { userInfo } = userContext;
  const [openMobileMenu, setOpenMobileMenu] = useState<boolean>(false);

  const [current, setCurrent] = useState("home");
  const pathname = usePathname();

  const [openMangeAccount, setOpenManageAccount] = useState<boolean>(false);

  useEffect(() => {
    setCurrent(pathname);
  }, [pathname]);

  const items: MenuProps["items"] = [
    {
      label: <Link href={"/home"}>Trang Chủ</Link>,
      key: "/home",
      icon: (
        <TwitterOutlined
          type="button"
          onPointerEnterCapture={() => {}}
          onPointerLeaveCapture={() => {}}
        />
      ),
    },
    {
      label: <Link href={"/home/job"}>Việc Làm IT</Link>,
      key: "/home/job",
      icon: (
        <CodeOutlined
          type="button"
          onPointerEnterCapture={() => {}}
          onPointerLeaveCapture={() => {}}
        />
      ),
    },
    {
      label: <Link href={"/home/company"}>Công ty IT</Link>,
      key: "/home/company",
      icon: (
        <RiseOutlined
          type="button"
          onPointerEnterCapture={() => {}}
          onPointerLeaveCapture={() => {}}
        />
      ),
    },
  ];

  const onClick: MenuProps["onClick"] = (e) => {
    setCurrent(e.key);
  };

  const handleLogout = async () => {
    const res = await callLogout();
    if (res && res.data) {
      dispatch(setLogoutAction({}));
      message.success("Đăng xuất thành công");
      route.push("/");
    }
  };

  const itemsDropdown = [
    {
      label: (
        <label
          style={{ cursor: "pointer" }}
          onClick={() => setOpenManageAccount(true)}
        >
          Quản lý tài khoản
        </label>
      ),
      key: "manage-account",
      icon: (
        <ContactsOutlined
          type="button"
          onPointerEnterCapture={() => {}}
          onPointerLeaveCapture={() => {}}
        />
      ),
    },
    {
      label: <Link href={"/admin"}>Trang Quản Trị</Link>,
      key: "admin",
      icon: (
        <DashOutlined
          type="button"
          onPointerEnterCapture={() => {}}
          onPointerLeaveCapture={() => {}}
        />
      ),
    },
    {
      label: (
        <label style={{ cursor: "pointer" }} onClick={() => handleLogout()}>
          Đăng xuất
        </label>
      ),
      key: "logout",
      icon: (
        <LogoutOutlined
          type="button"
          onPointerEnterCapture={() => {}}
          onPointerLeaveCapture={() => {}}
        />
      ),
    },
  ];

  //   const itemsMobiles = [...items, ...itemsDropdown];

  return (
    <>
      <div className={styles["header-section"]}>
        <div className={styles["container"]}>
          <div
            style={{
              display: "flex",
              gap: 30,
              alignItems: "center",
              height: "100%",
            }}
          >
            <div className={styles["brand"]}>
              <Link href="/home">
                <Image
                  style={{ width: "80px", height: "30px" }}
                  alt="example"
                  width={100}
                  height={100}
                  src={logoItViec}
                />
              </Link>
            </div>
            <div className={styles["top-menu"]}>
              <ConfigProvider
                theme={{
                  token: {
                    colorPrimary: "#fff",
                    colorBgContainer: "#222831",
                    colorText: "#a7a7a7",
                  },
                }}
              >
                <Menu
                  // onClick={onClick}
                  selectedKeys={[current]}
                  mode="horizontal"
                  items={items}
                />
              </ConfigProvider>
              <div className={styles["extra"]}>
                {isAuthenticated === false ? (
                  <Link style={{ fontSize: "18px" }} href={"/login"}>
                    Đăng nhập
                  </Link>
                ) : (
                  <Dropdown menu={{ items: itemsDropdown }} trigger={["click"]}>
                    <Space style={{ cursor: "pointer" }}>
                      <span style={{ fontSize: "16px" }}>
                        Welcome {userInfo?.name}
                      </span>
                      <Avatar
                        size={36}
                        style={{ border: "1px solid #ccc" }}
                        src={
                          userInfo?.avatar && (
                            <Image
                              alt="avatar"
                              width={100}
                              height={100}
                              style={{
                                width: "100%",
                                height: "100%",
                              }}
                              src={`${process.env.NEXT_PUBLIC_URL_BACKEND}/images/avatar/${userInfo?.avatar}`}
                            />
                          )
                        }
                      >
                        {!userInfo?.avatar &&
                          userInfo?.name?.substring(0, 1)?.toUpperCase()}{" "}
                      </Avatar>
                    </Space>
                  </Dropdown>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <Drawer
        title="Chức năng"
        placement="right"
        onClose={() => setOpenMobileMenu(false)}
        open={openMobileMenu}
      >
        <Menu
          onClick={onClick}
          selectedKeys={[current]}
          mode="vertical"
          items={itemsMobiles}
        />
      </Drawer> */}
      <ManageAccount open={openMangeAccount} onClose={setOpenManageAccount} />
    </>
  );
};

export default Header;
