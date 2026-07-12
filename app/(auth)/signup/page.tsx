"use client";

import {
  AuthLayout,
  AuthContainer,
  AuthCard,
  AuthLogo,
  AuthHeader,
} from "@/components/auth";

import { TextInput } from "@/components/auth/inputs";
import { PrimaryButton } from "@/components/auth/buttons";
import { AuthNotice } from "@/components/auth/notice";

export default function SignupPage() {
  return (
    <AuthLayout>
      <AuthContainer>
        <AuthCard>

          <AuthLogo />

          <AuthHeader
            title="Unda akaunti 🛒"
            subtitle="Jiunge na Winga — mwongozo bora wa huduma Tanzania."
          />

          <TextInput label="Jina Kamili" placeholder="Jina lako" />
          <TextInput label="Barua Pepe" type="email" placeholder="mfano@gmail.com" />
          <TextInput label="Nenosiri" type="password" placeholder="••••••••" />
          <TextInput label="Thibitisha Nenosiri" type="password" placeholder="••••••••" />

          <PrimaryButton text="Jisajili →" />

          <AuthNotice text="Una akaunti tayari? Ingia hapa." />

        </AuthCard>
      </AuthContainer>
    </AuthLayout>
  );
}
