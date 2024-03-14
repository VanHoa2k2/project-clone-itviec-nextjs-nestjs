"use client";

import { Button, Divider, Form, Input, message, notification } from "antd";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import styles from "@/styles/auth.module.scss";
import { callLogin } from "@/config/api";
import { useRouter } from "next/navigation";
import { setUserLoginInfo } from "../redux/slice/accountSlide";
import { useAppSelector } from "../redux/hooks";

const LoginPage = () => {
  // const navigate = useNavigate();
  const [isSubmit, setIsSubmit] = useState<boolean>(false);
  const dispatch = useDispatch();
  const isAuthenticated = useAppSelector(
    (state) => state?.account?.isAuthenticated
  );
  const user = useAppSelector((state) => state?.account?.user);
  const router = useRouter();
  // const callback = router.back() as string | undefined;
  // let params = new URLSearchParams(location.search);
  // const callback = params?.get("callback");
  useEffect(() => {
    //đã login => redirect to '/'
    if (isAuthenticated) {
      if (user.role.name === "NORMAL_USER") {
        router.push("/home");
      } else {
        router.push("/admin");
      }
    }
  }, [user.role.name, isAuthenticated, router]);

  const onFinish = async (values: any) => {
    const { username, password } = values;
    setIsSubmit(true);
    const res = await callLogin(username, password);
    setIsSubmit(false);
    if (res?.data) {
      localStorage.setItem("access_token", res.data.access_token);
      dispatch(setUserLoginInfo(res.data.user));
      message.success("Đăng nhập tài khoản thành công!");
    } else {
      notification.error({
        message: "Có lỗi xảy ra",
        description:
          res.message && Array.isArray(res.message)
            ? res.message[0]
            : res.message,
        duration: 5,
      });
    }
  };
  return (
    <div className={styles["login-page"]}>
      <main className={styles.main}>
        <div className={styles.container}>
          <section className={styles.wrapper}>
            <div className={styles.heading}>
              <h2 className={`${styles.text} ${styles["text-large"]}`}>
                Đăng Nhập
              </h2>
              <Divider />
            </div>
            <Form
              name="basic"
              // style={{ maxWidth: 600, margin: '0 auto' }}
              onFinish={onFinish}
              autoComplete="off"
            >
              <Form.Item
                labelCol={{ span: 24 }} //whole column
                label="Email"
                name="username"
                rules={[
                  { required: true, message: "Email không được để trống!" },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                labelCol={{ span: 24 }} //whole column
                label="Mật khẩu"
                name="password"
                rules={[
                  {
                    required: true,
                    message: "Mật khẩu không được để trống!",
                  },
                ]}
              >
                <Input.Password />
              </Form.Item>

              <Form.Item
              // wrapperCol={{ offset: 6, span: 16 }}
              >
                <Button type="primary" htmlType="submit" loading={isSubmit}>
                  Đăng nhập
                </Button>
              </Form.Item>
              <Divider>Or</Divider>
              <p className="text text-normal">
                Chưa có tài khoản ?
                <span>
                  <Link href="/register"> Đăng Ký </Link>
                </span>
              </p>
            </Form>
          </section>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;
