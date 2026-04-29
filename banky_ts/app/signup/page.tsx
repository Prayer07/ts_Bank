"use client"
import { useState, useEffect } from "react";
import { auth } from "../../services/firebase";
import { ConfirmationResult, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import PasswordInput from "../../components/PasswordInput";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function Signup() {
  const router = useRouter();
  const [step, setStep] = useState<"form" | "otp">("form");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    fullname: "",
    phone: "",
    password: "",
  });

  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);

  useEffect(() => {
    // create recaptcha
    generateRecaptcha();
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({...form, [e.target.name]: e.target.value});
  }

  async function requestOtp(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      // check phone formatting here (caller provides plain 080.... or +234)
      const phone = form.phone.startsWith("+") ? form.phone : `+234${form.phone.replace(/^0+/, "")}`;

      // optionally check phone not empty
      if (!phone) throw new Error("Phone is required");

      // send otp
      const appVerifier = window.recaptchaVerifier;
      const result = await signInWithPhoneNumber(auth, phone, appVerifier!);
      setConfirmationResult(result);
      setStep("otp");
      toast.success("OTP sent");
    } catch (err) {
        let message = "Signup failed";
        
        if (err instanceof Error) {
          message = err.message;
        } else if (typeof err === "string") {
          message = err;
        }

        toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  async function confirmOtp(e: React.FormEvent) {
    e.preventDefault();
    if (!confirmationResult) return toast.error("Request OTP first");

    try {
      setLoading(true);
      const userCred = await confirmationResult.confirm(otp);
      const uid = userCred.user.uid;
      // send to your server to create user & hash password
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid,
          fullname: form.fullname,
          phone: form.phone,
          password: form.password,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Signup failed");
      toast.success("Account created");
      router.push("/dashboard");
    } catch (err) {
        let message = "Invalid OTP or signup failed";
        
        if (err instanceof Error) {
          message = err.message;
        } else if (typeof err === "string") {
          message = err;
        }

        toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
    <div id="recaptcha-container"></div>
    {step === "form" &&(
    <div className="min-h-screen bg-[#0F0F14] flex items-center justify-center px-4">
      <Card className="w-full max-w-md bg-[#1A1F2C] border border-[#2A2F3C] shadow-2xl rounded-2xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold 
            bg-gradient-to-r from-[#0052FF] to-[#7B2FF7] 
            bg-clip-text text-transparent">
            Create your Banky Account
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={requestOtp} className="space-y-5">

            <Input
              name="fullname"
              type="text"
              placeholder="Full name"
              value={form.fullname}
              onChange={handleChange}
              required
              className="w-full rounded-md border border-input bg-[#111827] border-[#2A2F3C] px-3 py-2 pr-10 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            />

            <Input
              name="phone"
              type="number"
              placeholder="Phone Number"
              value={form.phone}
              onChange={handleChange}
              required
              className="w-full rounded-md border border-input bg-[#111827] border-[#2A2F3C] px-3 py-2 pr-10 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            />

            <PasswordInput
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
              required
            />

            <Button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl py-3 font-semibold 
                          bg-gradient-to-r from-[#0052FF] to-[#7B2FF7] 
                          hover:opacity-90 pointer"
            >
              {loading ? "Sending OTP..." : "Continue"}
            </Button>

            <p 
              className="text-sm text-center text-muted-foreground ">
              Don&apos;t have an account?{" "}
              <a 
                href="/login" 
                className="text-blue-400 underline"
              >
                Login
              </a>
            </p>

          </form>
        </CardContent>
      </Card>
    </div>
  )}

  {step === "otp" && (
  <div className="min-h-screen bg-[#0F0F14] flex items-center justify-center px-4">
    <Card className="w-full max-w-md bg-[#1A1F2C] border border-[#2A2F3C] shadow-2xl rounded-2xl">
      <CardHeader>
        <CardTitle className="text-center text-2xl font-bold 
          bg-gradient-to-r from-[#0052FF] to-[#7B2FF7] 
          bg-clip-text text-transparent">
          Create your Banky Account
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={confirmOtp} className="space-y-5">

          <Input
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full rounded-md border border-input bg-[#111827] border-[#2A2F3C] px-3 py-2 pr-10 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          />

          <Button 
            disabled={loading} 
            className="w-full rounded-xl py-3 font-semibold 
                        bg-gradient-to-r from-[#0052FF] to-[#7B2FF7] 
                        hover:opacity-90 pointer"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )}
  </>
  );
}

function generateRecaptcha() {
  if (typeof window !== "undefined") {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
        size: "invisible",
      });
    }
  }
}