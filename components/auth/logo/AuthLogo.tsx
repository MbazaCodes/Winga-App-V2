import Image from "next/image";
import styles from "./AuthLogo.module.css";

export default function AuthLogo() {
  return (
    <div className={styles.logo}>
      <Image
        src="/logo/logo.png"
        alt="Winga"
        width={48}
        height={48}
        priority
      />
      <span className={styles.wordmark}>Winga</span>
    </div>
  );
}
