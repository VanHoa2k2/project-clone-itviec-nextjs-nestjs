"use client";

import HeaderAdmin from "@/component/admin/HeaderAdmin";
import NavbarAdmin from "@/component/admin/NavbarAdmin";
import { Layout } from "antd";
import { Content } from "antd/es/layout/layout";
import { useEffect, useState } from "react";
import { useAppDispatch } from "../redux/hooks";
import { fetchAccount } from "../redux/slice/accountSlide";
import LayoutApp from "@/component/share/layout.app";
import ProtectedRoute from "@/component/share/protected-route.ts";
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(fetchAccount());
  }, []);
  const [collapsed, setCollapsed] = useState<boolean>(false);

  return (
    <LayoutApp>
      <Layout style={{ minHeight: "100vh" }} className="layout-admin">
        <NavbarAdmin collapsed={collapsed} setCollapsed={setCollapsed} />
        <Layout>
          <HeaderAdmin collapsed={collapsed} setCollapsed={setCollapsed} />
          <Content style={{ padding: "15px" }}>
            <ProtectedRoute>{children}</ProtectedRoute>
          </Content>
        </Layout>
      </Layout>
    </LayoutApp>
  );
}
