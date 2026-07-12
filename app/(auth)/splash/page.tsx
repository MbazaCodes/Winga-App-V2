"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import Image from "next/image";

import styles from "./Splash.module.css";

export default function SplashPage() {

    const router = useRouter();

    useEffect(() => {

        const timer = setTimeout(() => {

            router.replace("/onboarding");

        },2500);

        return ()=>clearTimeout(timer);

    },[router]);

    return(

        <main className={styles.page}>

            <div className={styles.logoBox}>

                <Image
                    src="/logo/logo.png"
                    alt="Winga"
                    width={120}
                    height={120}
                    priority
                />

                <h1>Winga</h1>

                <p>Tanzania's Services Guide</p>

            </div>

            <div className={styles.loader}>

                <div className={styles.bar}></div>

            </div>

        </main>

    );

}