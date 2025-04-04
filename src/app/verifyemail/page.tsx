"use client";

import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { LoaderCircle, CheckCircle, XCircle, Mail } from "lucide-react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function VerifyEmailPage() {
  const [token, setToken] = useState<string>("");
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  // const [manualMode, setManualMode] = useState(false);
  const router = useRouter();

  // Check token from URL on page load
  useEffect(() => {
    const urlToken = window.location.search.split("=")[1];
    if (urlToken) {
      setToken(urlToken);
      verifyUserEmail(urlToken);
    }
  }, []);

  // Verify token function
  const verifyUserEmail = async (inputToken: string) => {
    try {
      setLoading(true);
      await axios.post("/api/users/verifyemail", { token: inputToken });
      setVerified(true);
      toast.success("🎉 Signup successful! You can now log in.");
      setTimeout(() => {
        router.push("/login"); // Redirect to homepage after 2s
      }, 2000);
    } catch (error: any) {
      setError(true);
      toast.error("❌ Verification failed. Invalid or expired token.");
    } finally {
      setLoading(false);
    }
  };

  // Handle manual token submission
  const handleVerifyClick = () => {
    if (token.trim() === "") {
      toast.error("⚠️ Please enter a valid token.");
      return;
    }
    verifyUserEmail(token);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-[#295A47] to-[#D7E7D0] text-white px-4">
      <div className="bg-white text-black p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
        <h1 className="text-3xl font-bold mb-4 text-[#295A47]">Verify Your Email</h1>

        {/* Token Input Field */}
        {!verified && !loading && (
          <div className="mb-6 flex flex-col gap-4">
            <div className="flex items-center justify-center gap-2">
              <Mail className="text-teal-600" size={24} />
              <p className="text-gray-600">Enter your verification token below:</p>
            </div>
            <input
              type="text"
              placeholder="Paste token here"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:border-teal-500 text-black"
            />
            <button
              onClick={handleVerifyClick}
              className="bg-teal-600 cursor-pointer text-white px-6 py-2 rounded-full hover:bg-teal-700 transition-all"
            >
              Verify
            </button>
          </div>
        )}

        {/* Show Loader While Verifying */}
        {loading && (
          <div className="flex flex-col items-center gap-2">
            <LoaderCircle className="animate-spin text-[#295A47]" size={40} />
            <p className="text-gray-600">Verifying your email, please wait...</p>
          </div>
        )}

        {/* Show Success Message */}
        {verified && (
          <div className="flex flex-col items-center gap-4">
            <CheckCircle className="text-green-500" size={50} />
            <h2 className="text-2xl font-semibold text-green-600">Email Verified!</h2>
            <p className="text-gray-700">Your email has been successfully verified.</p>
            {/* <Link
              href="/home"
              className="bg-[#295A47] text-white px-6 py-2 rounded-full hover:bg-[#1D4F39] transition-all"
            >
              Go to Home
            </Link> */}
          </div>
        )}

        {/* Show Error Message */}
        {error && (
          <div className="flex flex-col items-center gap-4">
            <XCircle className="text-red-500" size={50} />
            <h2 className="text-2xl font-semibold text-red-600">Verification Failed!</h2>
            <p className="text-gray-700">Oops! Something went wrong. Please try again.</p>
            <Link
              href="/signup"
              className="bg-orange-500 text-white px-6 py-2 rounded-full hover:bg-orange-600 transition-all"
            >
              Go Back to Signup
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
