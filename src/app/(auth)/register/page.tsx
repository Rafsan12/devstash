import { auth } from '@/auth';
import { AuthShell } from '@/components/auth/auth-shell';
import { RegisterForm } from '@/components/auth/register-form';
import { redirect } from 'next/navigation';

const ENABLED_VALUES = new Set(['1', 'true', 'yes', 'on']);

function isEmailVerificationEnabled() {
  const rawValue = process.env.EMAIL_VERIFICATION_ENABLED;

  if (rawValue === undefined) {
    return true;
  }

  return ENABLED_VALUES.has(rawValue.trim().toLowerCase());
}

export default async function RegisterPage() {
  const session = await auth();

  if (session?.user) {
    redirect('/dashboard');
  }

  const emailVerificationEnabled = isEmailVerificationEnabled();

  return (
    <AuthShell
      description="Create a DevStash account and start organizing your developer knowledge in one secure place."
      eyebrow="Registration"
      title="Build a workspace that remembers the useful things."
    >
      <RegisterForm emailVerificationEnabled={emailVerificationEnabled} />
    </AuthShell>
  );
}
