"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";

function VerifyPayment() {
  const params = useSearchParams();
  const router = useRouter();

  const reference = params.get("reference");
  const amount = params.get("amount");

  useEffect(() => {
    if (!reference || !amount) return;

    const verifyPayment = async () => {
      try {
        const res = await axios.post("/api/transactions/verify-payment", {
          ref: reference,
          amount,
        });

        console.log(res.data);
        toast.success("Payment verified! 🎉");

        // Redirect after successful verification
        // router.push(`/receipt/${res.data.receiptId}`);
      } catch (err: unknown) {
        let message = "Verification failed";

        if (err instanceof Error) {
          message = err.message;
        }

        toast.error(message);
        router.push("/dashboard");
      }
    };

    verifyPayment();
  }, [reference, amount, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-xl font-bold">Verifying Payment...</p>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-xl font-bold">Loading...</p>
        </div>
      }
    >
      <VerifyPayment />
    </Suspense>
  );
}