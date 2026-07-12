import styles from "./Background.module.css";

export default function Background() {
  return (
    <div className={styles.wrapper}>
      <div className={`${styles.orb} ${styles.blue}`}></div>
      <div className={`${styles.orb} ${styles.gold}`}></div>
      <div className={`${styles.orb} ${styles.light}`}></div>
    </div>
  );
}