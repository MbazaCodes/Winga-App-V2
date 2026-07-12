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

export default function LoginPage() {
  return (
    <AuthLayout>
      <AuthContainer>
        <AuthCard>

          <AuthLogo />

          <AuthHeader
            title="Karibu! 👋"
            subtitle="Ingiza namba yako au Winga ID — utatumia code ya OTP bure."
          />

          <LoginMethodToggle />

          <PhoneInput />

          <PrimaryButton
            text="Pata Code ya OTP →"
          />

          <AuthNotice
            text="SMS ya OTP ni ya bure na salama kabisa."
          />

        </AuthCard>
      </AuthContainer>
    </AuthLayout>
  );
}