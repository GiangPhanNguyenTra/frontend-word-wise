"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  ForgotPasswordStep1Schema,
  ForgotPasswordStep2Schema,
  ForgotPasswordStep3Schema,
} from "@/lib/validators/auth";
import { Eye, EyeOff } from "lucide-react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  requestForgotPasswordCode,
  resetPassword,
} from "@/services/authService";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const ForgotPasswordSchema = ForgotPasswordStep1Schema.merge(
  ForgotPasswordStep2Schema
).merge(ForgotPasswordStep3Schema);
type ForgotPasswordFormValues = z.infer<typeof ForgotPasswordSchema>;

export function ForgotPasswordForm() {
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: {
      email: "",
      code: "",
      newPassword: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (step !== 2 || canResend) return;

    const timerId = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown <= 1) {
          clearInterval(timerId);
          setCanResend(true);
          return 0;
        }
        return prevCountdown - 1;
      });
    }, 1000);

    return () => clearInterval(timerId);
  }, [step, canResend]);

  const handleResend = async () => {
    const email = form.getValues("email");
    if (!email) return;

    try {
      await requestForgotPasswordCode(email);
      toast.success("Resend successful", {
        description: "New verification code sent.",
      });
      setCountdown(30);
      setCanResend(false);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to resend code.";

      toast.error("Failed to resend", {
        description: message,
      });
    }
  };

  const handleStep1Submit = async () => {
    const isEmailValid = await form.trigger("email");
    if (isEmailValid) {
      setIsLoading(true);
      const email = form.getValues("email");
      try {
        await requestForgotPasswordCode(email);
        toast.success("Code Sent", {
          description: `Verification code sent to ${email}.`,
        });
        setStep(2);
        setCountdown(30);
        setCanResend(false);
      } catch (error: unknown) {
        const message =
          error instanceof Error ? error.message : "Failed to send code.";

        toast.error("Failed to send code", {
          description: message,
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleStep2Submit = async () => {
    const isCodeValid = await form.trigger("code");
    if (isCodeValid) {
      setIsLoading(true);
      try {
        toast.info("Please set your new password.");
        setStep(3);
      } catch (error: unknown) {
        const message =
          error instanceof Error ? error.message : "Invalid code.";

        toast.error("Verification Failed", {
          description: message,
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const onFinalSubmit = async (values: ForgotPasswordFormValues) => {
    setIsLoading(true);
    try {
      await resetPassword({
        email: values.email,
        code: values.code,
        newPassword: values.newPassword,
        confirmPassword: values.confirmPassword,
      });
      toast.success("Password Reset Success", {
        description: "Password has been reset successfully.",
      });
      router.push("/login");
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to reset password.";

      toast.error("Reset Failed", {
        description: message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onFinalSubmit)} className="space-y-6">
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold flex justify-between items-center">
                Forgot password{" "}
                <span className="text-lg text-muted-foreground">1/3</span>
              </h1>
              <p className="text-muted-foreground mt-2">
                Enter your email for the verification proccess,we will send 4
                digits code to your email.
              </p>
            </div>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your email"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="button"
              onClick={handleStep1Submit}
              className="w-full bg-primary"
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"
                    ></path>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M12 0C5.373 0 0 5.373 0 12h4c0-4.418 3.582-8 8-8v4z"
                    ></path>
                  </svg>
                  Sending code...
                </div>
              ) : (
                "Continue"
              )}
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 text-center">
            <div>
              <h1 className="text-3xl font-bold flex justify-between items-center">
                Verification{" "}
                <span className="text-lg text-muted-foreground">2/3</span>
              </h1>
              <p className="text-muted-foreground mt-2 text-left">
                Enter your 4 digits code that you received on your email.
              </p>
            </div>
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem className="flex flex-col items-center justify-center">
                  <FormControl>
                    <InputOTP maxLength={4} {...field} disabled={isLoading}>
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {!canResend && countdown > 0 && (
              <p className="text-sm text-red-500">
                00:{countdown.toString().padStart(2, "0")}
              </p>
            )}
            <Button
              type="button"
              onClick={handleStep2Submit}
              className="w-full bg-primary"
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"
                    ></path>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M12 0C5.373 0 0 5.373 0 12h4c0-4.418 3.582-8 8-8v4z"
                    ></path>
                  </svg>
                  Verifying...
                </div>
              ) : (
                "Verify"
              )}
            </Button>
            <p className="text-sm text-muted-foreground">
              If you didn&apos;t receive a code!{" "}
              <button
                type="button"
                onClick={handleResend}
                disabled={!canResend || isLoading}
                className="font-semibold text-red-500 disabled:text-muted-foreground disabled:cursor-not-allowed hover:underline"
              >
                Resend
              </button>
            </p>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold flex justify-between items-center">
                New password{" "}
                <span className="text-lg text-muted-foreground">3/3</span>
              </h1>
              <p className="text-muted-foreground mt-2">
                Set the new password for your account so you can login and
                access all features.
              </p>
            </div>
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New password</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter new password"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground"
                    >
                      {showPassword ? (
                        <Eye className="h-5 w-5" />
                      ) : (
                        <EyeOff className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm password</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Re-enter your password"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground"
                    >
                      {showConfirmPassword ? (
                        <Eye className="h-5 w-5" />
                      ) : (
                        <EyeOff className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full bg-primary"
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"
                    ></path>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M12 0C5.373 0 0 5.373 0 12h4c0-4.418 3.582-8 8-8v4z"
                    ></path>
                  </svg>
                  Updating...
                </div>
              ) : (
                "Update password"
              )}
            </Button>
          </div>
        )}
      </form>
    </Form>
  );
}
