import { ReactNode } from "react";
import { Background } from "@/components/ui";

import styles from "./AuthLayout.module.css";

type Props = {
  children: ReactNode;
};

export default function AuthLayout({
  children,
}: Props) {
  return (
    <>
      <Background />

      <main className={styles.layout}>
        {children}
      </main>
    </>
  );
}