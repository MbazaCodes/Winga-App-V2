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

        <div className={styles.logoRing}>
          <Image
            src="/logo/logo.png"
            alt="Winga"
            width={100}
            height={100}
            priority
            className={styles.logoImg}
          />
        </div>

        <h1 className={styles.brand}>
          <span className={styles.brandWhite}>Wing</span><span className={styles.brandGold}>a</span>
        </h1>

        <p className={styles.tagline}>Tanzania&apos;s Services Guide</p>

      </div>

      <div className={styles.loader}>
        <div className={styles.bar} />
      </div>

    </main>
  );
}
