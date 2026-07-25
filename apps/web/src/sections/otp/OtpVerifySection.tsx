"use client";

import { PawPrintIcon } from "lucide-react";
import Link from "next/link";
import { type FormEvent, useState } from "react";
import { Button } from "@/components/button/Button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/input-otp/InputOtp";
import { Label } from "@/components/label/Label";
import { ScrollReveal } from "@/components/motion/scroll-reveal/ScrollReveal";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";

const OTP_SLOT_INDICES = [0, 1, 2, 3, 4, 5] as const;

type OtpVerifySectionProps = {
  className?: string;
};

function OtpVerifySection({ className }: OtpVerifySectionProps) {
  const [value, setValue] = useState("");
  const [verified, setVerified] = useState(false);
  const [resent, setResent] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (value.length !== 6) return;
    setVerified(true);
  };

  const handleResend = () => {
    setResent(true);
    setValue("");
    setVerified(false);
  };

  return (
    <section
      data-slot="otp-verify-section"
      className={cn(
        "relative flex min-h-[70vh] items-center justify-center overflow-hidden bg-brand-warm-cream px-4 py-16 md:px-8 md:py-24",
        className,
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,107,107,0.12),transparent_55%),radial-gradient(ellipse_at_bottom,rgba(167,139,250,0.14),transparent_50%)]"
      />

      <ScrollReveal className="relative w-full max-w-md">
        <div className="rounded-[28px] border border-[rgba(23,21,31,0.08)] bg-brand-white p-6 shadow-[0_24px_80px_rgba(49,35,62,0.12)] md:p-8">
          <div className="mb-6 flex flex-col items-center text-center">
            <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-brand-coral/15">
              <PawPrintIcon className="size-6 text-brand-coral" aria-hidden />
            </div>
            <h1 className="font-display text-3xl font-semibold text-brand-deep-ink md:text-4xl">
              Confirm it&apos;s you
            </h1>
            <p className="mt-3 max-w-sm text-base leading-relaxed text-brand-ink-500">
              We sent a 6-digit code to your email. Enter it below — it expires in 10 minutes.
            </p>
          </div>

          {verified ? (
            <div
              role="status"
              className="rounded-[20px] border border-brand-mint/40 bg-brand-mint/15 px-6 py-8 text-center"
            >
              <p className="font-display text-xl font-semibold text-brand-deep-ink">
                You&apos;re verified
              </p>
              <p className="mt-2 text-sm text-brand-ink-500">
                Welcome back — your pack is waiting.
              </p>
              <Link
                href={ROUTES.home}
                className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-full bg-brand-coral px-5 text-sm font-medium text-white hover:bg-brand-coral/90"
              >
                Continue to PawPair
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="flex flex-col items-center gap-3">
                <Label htmlFor="otp-input" className="sr-only">
                  Verification code
                </Label>
                <InputOTP
                  id="otp-input"
                  maxLength={6}
                  value={value}
                  onChange={setValue}
                  autoFocus
                  containerClassName="gap-2"
                >
                  <InputOTPGroup className="gap-2">
                    {OTP_SLOT_INDICES.map((slotIndex) => (
                      <InputOTPSlot
                        key={`otp-slot-${slotIndex}`}
                        index={slotIndex}
                        className="size-11 rounded-xl border border-brand-ink-200 text-base font-medium text-brand-deep-ink first:rounded-xl first:border-l last:rounded-xl data-[active=true]:border-brand-coral data-[active=true]:ring-brand-coral/30 sm:size-12"
                      />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
              </div>

              <Button
                type="submit"
                disabled={value.length !== 6}
                className="h-11 w-full rounded-full bg-brand-coral text-sm font-medium text-white hover:bg-brand-coral/90 disabled:opacity-50"
              >
                Verify code
              </Button>

              <p className="text-center text-sm text-brand-ink-500">
                Didn&apos;t receive a code?{" "}
                <button
                  type="button"
                  onClick={handleResend}
                  className="font-medium text-brand-coral underline-offset-4 hover:underline"
                >
                  Resend it
                </button>
                {resent ? (
                  <span className="mt-1 block text-xs text-brand-mint" role="status">
                    A new code is on its way.
                  </span>
                ) : null}
              </p>
            </form>
          )}

          <p className="mt-6 text-center text-sm text-brand-ink-500">
            <Link
              href={ROUTES.signIn}
              className="font-medium text-brand-ink-700 underline-offset-4 hover:text-brand-coral hover:underline"
            >
              ← Back to sign in
            </Link>
          </p>
        </div>
      </ScrollReveal>
    </section>
  );
}

export { OtpVerifySection };
