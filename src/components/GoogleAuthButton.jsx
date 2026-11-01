"use client";

import { useState } from "react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

export default function GoogleAuthButton() {
  const [isSigningIn, setIsSigningIn] = useState(false);

  async function handleGoogleSignIn() {
    setIsSigningIn(true);

    try {
      const { error } = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/my-books",
      });

      if (error) {
        throw new Error(error.message || "Could not continue with Google.");
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Google sign-in failed. Please try again.",
      );
      setIsSigningIn(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleGoogleSignIn}
      disabled={isSigningIn}
      className="inline-flex w-full items-center justify-center gap-3 rounded-full border border-foreground/15 bg-background/60 px-5 py-3 text-sm font-semibold text-foreground shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-background/90 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60"
    >
      <span
        aria-hidden="true"
        className="bg-clip-text text-lg font-bold text-transparent"
        style={{
          backgroundImage:
            "linear-gradient(135deg, #4285F4 20%, #34A853 40%, #FBBC05 60%, #EA4335 80%)",
        }}
      >
        G
      </span>
      {isSigningIn ? "Connecting to Google..." : "Continue with Google"}
    </button>
  );
}
