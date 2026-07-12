import Image from "next/image";
import styles from "./AuthLogo.module.css";

export default function AuthLogo() {
  return (
    <div className={styles.logo}>
      <Image
        src="/logo/logo.png"
        alt="Winga"
        width={80}
        height={80}
        priority
        className={styles.logoImg}
      />
    </div>
  );
}
