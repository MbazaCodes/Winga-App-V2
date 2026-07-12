import styles from "./PrimaryButton.module.css";

type Props = {
  text: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
};

export default function PrimaryButton({
  text,
  onClick,
  disabled = false,
  type = "button",
}: Props) {
  return (
    <button
      className={styles.button}
      onClick={onClick}
      disabled={disabled}
      type={type}
    >
      {text}
    </button>
  );
}
