"use client";

import {
  AuthLayout,
  AuthContainer,
  AuthCard,
  AuthLogo,
  AuthHeader,
} from "@/components/auth";

import { PhoneInput } from "@/components/auth/inputs";
import { PrimaryButton } from "@/components/auth/buttons";
import { LoginMethodToggle } from "@/components/auth/toggle";
import { AuthNotice } from "@/components/auth/notice";

import styles from "./Login.module.css";

export default function LoginPage() {
  return (
    <AuthLayout>
      <AuthContainer>
        <AuthCard>

          <AuthLogo />

          <AuthHeader
            title="Karibu tena! 👋"
            subtitle="Ingiza namba yako au Winga ID — utatumia code ya OTP bure."
          />

          <LoginMethodToggle />

          <PhoneInput />

          <PrimaryButton text="Pata Code ya OTP →" />

          <div className={styles.divider}>
            <span>au ingia kupitia</span>
          </div>

          <div className={styles.social}>
            <button className={styles.socialBtn} aria-label="Google">G</button>
            <button className={styles.socialBtn} aria-label="Facebook">f</button>
            <button className={styles.socialBtn} aria-label="Twitter">𝕏</button>
          </div>

          <AuthNotice text="SMS ya OTP ni ya bure na salama kabisa." />

        </AuthCard>
      </AuthContainer>
    </AuthLayout>
  );
}
