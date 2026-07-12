import styles from "./AuthHeader.module.css";

type Props = {
  title: string;
  subtitle: string;
};

export default function AuthHeader({
  title,
  subtitle,
}: Props) {
  return (
    <div className={styles.header}>

      <h1>{title}</h1>

      <p>{subtitle}</p>

    </div>
  );
}