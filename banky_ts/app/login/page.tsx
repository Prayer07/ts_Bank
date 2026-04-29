"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import PasswordInput from "../../components/PasswordInput";

export default function LoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Login failed");
      toast.success("Logged in");
      router.push("/dashboard");
    } catch (err) {
        let message = "Login failed";
        
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

    <div className="min-h-screen bg-[#0F0F14] flex items-center justify-center px-4">
      <Card className="w-full max-w-md p-6 bg-[#1A1F2C] border border-[#2A2F3C] shadow-xl rounded-2xl">
        <CardHeader>
          <CardTitle className="text-center text-3xl font-bold 
            bg-gradient-to-r from-[#0052FF] to-[#7B2FF7] 
            bg-clip-text text-transparent">
            Login to Banky
          </CardTitle>
        </CardHeader>

      <CardContent>
        <form onSubmit={handleLogin} className="space-y-5">

          <Input
            type="text"
            placeholder="Phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            className="w-full rounded-md border border-input bg-[#111827] border-[#2A2F3C] px-3 py-2 pr-10 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          />

          <PasswordInput
            name="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button 
            type="submit"
            disabled={loading}
            className="w-full rounded-xl py-3 font-semibold 
                      bg-gradient-to-r from-[#0052FF] to-[#7B2FF7] 
                      hover:opacity-90 pointer"
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
          <p 
            className="text-sm text-center text-muted-foreground"
          >
            Already have an account?{" "}
            <a 
              href="/signup" 
              className="text-blue-400 underline"
              >
                Signup
            </a>
          </p>
        </form>
        </CardContent>
      </Card>
    </div>
    </>
  );
}