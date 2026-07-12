import Image from "next/image";
import styles from "./AuthLogo.module.css";

export default function AuthLogo() {
  return (
    <div className={styles.logo}>
      <Image
        src="/logo/logo.png"
        alt="Winga"
        width={110}
        height={110}
        priority
        className={styles.logoImg}
      />
      <span className={styles.wordmark}>Winga</span>
    </div>
  );
}
