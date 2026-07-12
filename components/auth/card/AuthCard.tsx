import { ReactNode } from "react";

import styles from "./AuthCard.module.css";

type Props = {
    children: ReactNode;
};

export default function AuthCard({
    children,
}: Props) {

    return (

        <section className={styles.card}>

            {children}

        </section>

    );

}