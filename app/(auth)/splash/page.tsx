"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import styles from "./Splash.module.css";

export default function SplashPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/login");
    }, 2800);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <main className={styles.page}>
      <div className={styles.logoBox}>
        <Image
          src="/logo/logo.png"
          alt="Winga"
          width={200}
          height={200}
          priority
          className={styles.logoImg}
        />
        <p className={styles.tagline}>Tanzania&apos;s Services Guide</p>
      </div>
      <div className={styles.loader}>
        <div className={styles.bar} />
      </div>
    </main>
  );
}
