import styles from "./AuthNotice.module.css";

type Props = {
  text: string;
};

export default function AuthNotice({ text }: Props) {
  return (
    <div className={styles.notice}>
      🔒 {text}
    </div>
  );
}