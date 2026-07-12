import styles from "./TextInput.module.css";

type Props = {
  label: string;
  placeholder?: string;
  type?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function TextInput({
  label,
  placeholder,
  type = "text",
  value,
  onChange,
}: Props) {
  return (
    <div className={styles.wrapper}>
      <label className={styles.label}>{label}</label>

      <input
        className={styles.input}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}