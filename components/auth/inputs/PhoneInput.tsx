import styles from "./PhoneInput.module.css";

type Props = {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function PhoneInput({
  value,
  onChange,
}: Props) {
  return (
    <div className={styles.wrapper}>

      <label className={styles.label}>
        Namba ya Simu
      </label>

      <div className={styles.phoneBox}>

        <span className={styles.prefix}>
          🇹🇿 +255
        </span>

        <input
          className={styles.input}
          placeholder="712 345 678"
          value={value}
          onChange={onChange}
        />

      </div>

      <small className={styles.help}>
        Bila +255 au 0 mwanzoni
      </small>

    </div>
  );
}