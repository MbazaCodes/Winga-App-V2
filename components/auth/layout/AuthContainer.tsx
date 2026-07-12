import { ReactNode } from "react";

import styles from "./AuthContainer.module.css";

type Props = {
    children: ReactNode;
};

export default function AuthContainer({
    children,
}: Props) {
    return (
        <section className={styles.container}>
            {children}
        </section>
    );
}