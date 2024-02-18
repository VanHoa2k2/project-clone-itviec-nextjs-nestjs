"use client";

import styles from "./page.module.css";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const pathname = usePathname();
  const route = useRouter();

  useEffect(() => {
    if (pathname === "/") {
      route.push("/home");
    }
  }, [pathname, route]);

  return <main className={styles.main}></main>;
}
