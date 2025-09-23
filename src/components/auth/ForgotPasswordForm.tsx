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

// 1. Tạo một schema tổng hợp tất cả các trường
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

  // 2. Chỉ sử dụng MỘT useForm cho toàn bộ flow
  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: {
      email: "",
      code: "",
      newPassword: "",
      confirmPassword: "",
    },
    // Validate khi thay đổi để người dùng thấy lỗi ngay lập tức
    mode: "onChange",
  });

  // Timer effect cho resend code
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

  const handleResend = () => {
    console.log("Resending code to", form.getValues("email"));
    setCountdown(30);
    setCanResend(false);
  };

  // 3. Xử lý logic cho từng bước
  const handleStep1Submit = async () => {
    // Chỉ validate trường email
    const isEmailValid = await form.trigger("email");
    if (isEmailValid) {
      console.log("Sending code to:", form.getValues("email"));
      setStep(2);
    }
  };

  const handleStep2Submit = async () => {
    // Chỉ validate trường code
    const isCodeValid = await form.trigger("code");
    if (isCodeValid) {
      console.log("Verifying code:", form.getValues("code"));
      setStep(3);
    }
  };

  // Hàm submit cuối cùng cho cả form
  const onFinalSubmit = (values: ForgotPasswordFormValues) => {
    console.log("Updating password:", values.newPassword);
    alert("Password updated successfully!");
    // Logic chuyển trang về login ở đây
  };

  // 4. Render UI dựa trên state `step`
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
                    <Input placeholder="Enter your email" {...field} />
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
            >
              Continue
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
                    <InputOTP maxLength={4} {...field}>
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
            >
              Verify
            </Button>
            <p className="text-sm text-muted-foreground">
              If you didn&apos;t receive a code!{" "}
              <button
                type="button"
                onClick={handleResend}
                disabled={!canResend}
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
            <Button type="submit" className="w-full bg-primary" size="lg">
              Update password
            </Button>
          </div>
        )}
      </form>
    </Form>
  );
}
