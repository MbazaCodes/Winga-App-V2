"use client";

import { useState } from "react";
import styles from "./LoginMethodToggle.module.css";

export default function LoginMethodToggle() {
  const [active, setActive] = useState<"phone" | "winga">("phone");

  return (
    <div className={styles.wrapper}>

      <div
        className={`${styles.slider} ${
          active === "winga" ? styles.right : ""
        }`}
      />

      <button
        className={active === "phone" ? styles.active : ""}
        onClick={() => setActive("phone")}
      >
        Namba ya Simu
      </button>

      <button
        className={active === "winga" ? styles.active : ""}
        onClick={() => setActive("winga")}
      >
        Winga ID
      </button>

    </div>
  );
}