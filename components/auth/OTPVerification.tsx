"use client";

import { useState, useEffect, useRef } from "react";
import { Loader2, ArrowRight, Mail, ShieldCheck, RefreshCcw } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";

interface OTPVerificationProps {
  email: string;
  onSuccess: (user: any) => void;
  onBack: () => void;
}

export default function OTPVerification({ email, onSuccess, onBack }: OTPVerificationProps) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [timer, setTimer] = useState(60);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const code = otp.join("");
    if (code.length !== 6) {
      toast.error("Please enter the 6-digit code");
      return;
    }

    setIsVerifying(true);
    try {
      const res = await api.post("/auth/verify-otp", { email, otp: code });
      toast.success("Registration successful!");
      onSuccess(res.data.user);
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Invalid verification code");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (timer > 0) return;
    
    setIsResending(true);
    try {
      await api.post("/auth/resend-otp", { email });
      toast.success("New code sent to your email");
      setTimer(60);
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } catch (err: any) {
      toast.error("Failed to resend code");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-2">
        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-primary/20">
          <ShieldCheck className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight font-heading">Verify your email</h2>
        <p className="text-muted-foreground text-sm flex items-center justify-center gap-1.5">
          <Mail className="w-4 h-4" />
          Code sent to <span className="text-foreground font-semibold">{email}</span>
        </p>
      </div>

      <div className="flex justify-center gap-2 sm:gap-4">
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={(el) => { inputRefs.current[index] = el; }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            className="w-10 h-12 sm:w-14 sm:h-16 text-center text-2xl font-black rounded-xl border-2 border-border bg-background focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none"
          />
        ))}
      </div>

      <div className="space-y-4">
        <button
          onClick={handleVerify}
          disabled={isVerifying}
          className="w-full flex items-center justify-center gap-2 bg-primary text-white py-4 rounded-2xl font-bold shadow-lg shadow-primary/25 hover:shadow-primary/40 active:scale-[0.98] transition-all disabled:opacity-50 disabled:active:scale-100"
        >
          {isVerifying ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              Verify & Create Account
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>

        <div className="flex flex-col items-center gap-4">
          <div className="text-sm text-muted-foreground">
            Didn't receive the code?{" "}
            {timer > 0 ? (
              <span className="text-primary font-bold">Resend in {timer}s</span>
            ) : (
              <button
                onClick={handleResend}
                disabled={isResending}
                className="text-primary font-bold hover:underline inline-flex items-center gap-1"
              >
                {isResending && <Loader2 className="w-3 h-3 animate-spin" />}
                Resend Now
              </button>
            )}
          </div>
          
          <button
            onClick={onBack}
            className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors uppercase tracking-widest"
          >
            ← Use a different email
          </button>
        </div>
      </div>
    </div>
  );
}
