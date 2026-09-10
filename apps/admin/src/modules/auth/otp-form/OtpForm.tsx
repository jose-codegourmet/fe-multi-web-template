"use client";

import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from "@fe-template/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { KeyRoundIcon, Loader2Icon } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { createClient } from "@/lib/supabase/client";
import { createProfile } from "./actions";
import { otpDefaultValues } from "./OtpForm.defaults";
import { type OtpFormValues, otpSchema } from "./OtpForm.schema";

type ResendStatus = "idle" | "loading" | "success" | "error";

export function OtpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";

  const [cooldown, setCooldown] = useState(0);
  const [resendStatus, setResendStatus] = useState<ResendStatus>("idle");
  const [resendError, setResendError] = useState<string | null>(null);

  const form = useForm<OtpFormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: otpDefaultValues,
  });

  useEffect(() => {
    if (cooldown <= 0) return;

    const timer = window.setInterval(() => {
      setCooldown((seconds) => (seconds <= 1 ? 0 : seconds - 1));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [cooldown]);

  useEffect(() => {
    if (resendStatus !== "success") return;

    const timer = window.setTimeout(() => {
      setResendStatus("idle");
    }, 2000);

    return () => window.clearTimeout(timer);
  }, [resendStatus]);

  async function handleResend() {
    if (!email || cooldown > 0 || resendStatus === "loading") return;

    setResendStatus("loading");
    setResendError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
    });

    if (error) {
      setResendStatus("error");
      setResendError(error.message);
      return;
    }

    setResendStatus("success");
    setCooldown(60);
  }

  async function onSubmit(values: OtpFormValues) {
    if (!email) {
      form.setError("root", { message: "Missing email. Please sign up again." });
      return;
    }

    const supabase = createClient();
    const { data, error: verifyError } = await supabase.auth.verifyOtp({
      email,
      token: values.token,
      type: "signup",
    });

    if (verifyError) {
      form.setError("root", { message: verifyError.message });
      return;
    }

    const user = data.user;
    if (!user?.id || !user.email) {
      form.setError("root", { message: "Could not verify user. Please try again." });
      return;
    }

    try {
      await createProfile(user.id, user.email);
    } catch {
      form.setError("root", {
        message: "Account verified, but profile could not be created. Try signing in.",
      });
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  if (!email) {
    return (
      <div className="space-y-4 text-center">
        <p className="text-sm text-muted-foreground">
          Missing email. Please sign up again to receive a confirmation code.
        </p>
        <Link href="/signup" className="text-sm text-primary underline-offset-4 hover:underline">
          Back to sign up
        </Link>
      </div>
    );
  }

  const resendLabel =
    resendStatus === "loading"
      ? "Sending…"
      : resendStatus === "success"
        ? "Sent!"
        : cooldown > 0
          ? `Resend in ${cooldown}s`
          : "Resend code";

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <p className="text-center text-sm text-muted-foreground">
          We sent a 6-digit code to <span className="font-medium text-foreground">{email}</span>
        </p>

        <FormField
          control={form.control}
          name="token"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirmation code</FormLabel>
              <FormControl>
                <div className="relative">
                  <KeyRoundIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    {...field}
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                    placeholder="000000"
                    className="h-11 rounded-xl pl-9 tracking-[0.3em]"
                    onChange={(event) => {
                      const digits = event.target.value.replace(/\D/g, "").slice(0, 6);
                      field.onChange(digits);
                    }}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {form.formState.errors.root ? (
          <p className="text-sm text-destructive">{form.formState.errors.root.message}</p>
        ) : null}

        <Button
          type="submit"
          className="h-11 w-full rounded-full"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? (
            <>
              <Loader2Icon className="size-4 animate-spin" />
              Verifying…
            </>
          ) : (
            "Confirm email"
          )}
        </Button>

        <div className="space-y-2 text-center text-sm text-muted-foreground">
          <p className="flex flex-wrap items-center justify-center gap-x-1 gap-y-1">
            <span>Didn&apos;t receive a code?</span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-auto px-1.5 py-0 text-primary underline-offset-4 hover:bg-transparent hover:underline"
              disabled={cooldown > 0 || resendStatus === "loading"}
              onClick={handleResend}
            >
              {resendStatus === "loading" ? (
                <>
                  <Loader2Icon className="size-3.5 animate-spin" />
                  {resendLabel}
                </>
              ) : (
                resendLabel
              )}
            </Button>
            <span className="text-muted-foreground/50">·</span>
            <span>
              Wrong email?{" "}
              <Link href="/signup" className="text-primary underline-offset-4 hover:underline">
                Sign up again
              </Link>
            </span>
          </p>

          {resendStatus === "error" && resendError ? (
            <p className="text-sm text-destructive">{resendError}</p>
          ) : null}
        </div>
      </form>
    </Form>
  );
}
