"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated, login } = useAuth();
  const [user, setUser] = useState({
    login: "",
    password: "",
  });

  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  // Wait for auth check before rendering
  useEffect(() => {
    setAuthChecked(true);
  }, []);

  // Redirect if already logged in
  useEffect(() => {
    if (authChecked && isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router, authChecked]);

  // Handle login submission
  const onLogin = async () => {
    try {
      setLoading(true);
      const response = await axios.post("/api/users/login", user);
      
      if (response.data.success) {
        // Update auth state
        login(response.data.user);
        // Show welcome toast
        toast.success("🎉 Welcome back to Kayapalat family!");
        // Add a small delay to ensure state updates
        setTimeout(() => {
          router.push("/");
        }, 100);
      } else {
        if (response.data.code === "USER_NOT_FOUND") {
          toast.error("No account found with that email or username.");
        } else if (response.data.code === "WRONG_PASSWORD") {
          toast.error("Incorrect password for this account.");
        } else {
          toast.error(response.data.error || "Login failed. Please try again.");
        }
      }
    } catch (error: any) {
      console.error("Login failed", error);
      if (error.response?.data?.error) {
        if (error.response.data.code === "USER_NOT_FOUND") {
          toast.error("No account found with that email or username.");
        } else if (error.response.data.code === "WRONG_PASSWORD") {
          toast.error("Incorrect password for this account.");
        } else {
          toast.error(error.response.data.error);
        }
      } else {
        toast.error("Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Disable button if fields are empty
  useEffect(() => {
    if (user.login.length > 0 && user.password.length > 0) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [user]);

  if (!authChecked) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#D2EBD0]">
        <span className="text-teal-700 text-lg font-semibold">Checking authentication...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#D2EBD0] sm:bg-[#E8F5E9] transition-all duration-300 text-black p-6">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md border border-gray-200 transition-all duration-300">
        {/* Heading */}
        <h1 className="text-2xl font-bold text-center mb-4 text-teal-700">
          {loading ? "Processing..." : "Welcome Back!"}
        </h1>
        <p className="text-gray-600 text-center mb-6">
          Log in to your Kayapalat account.
        </p>

        {/* Login Form */}
        <div className="flex flex-col">
          {/* Email or Username */}
          <label htmlFor="login" className="mb-1 text-sm text-gray-700">
            Email or Username
          </label>
          <input
            className="p-3 border border-gray-300 rounded-lg mb-4 bg-white text-black focus:outline-none focus:border-teal-500"
            id="login"
            type="text"
            value={user.login}
            onChange={(e) => setUser({ ...user, login: e.target.value })}
            placeholder="Enter email or username"
          />

          {/* Password */}
          <label htmlFor="password" className="mb-1 text-sm text-gray-700">
            Password
          </label>
          <div className="relative mb-4">
            <input
              className="p-3 border border-gray-300 rounded-lg w-full bg-white text-black focus:outline-none focus:border-teal-500"
              id="password"
              type={showPassword ? "text" : "password"}
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              placeholder="Enter password"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !buttonDisabled && !loading) {
                  onLogin();
                }
              }}
            />
            {/* Show/Hide Password Button */}
            <button
              type="button"
              className="absolute cursor-pointer inset-y-0 right-3 flex items-center text-sm text-gray-600 hover:text-teal-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>

          {/* Forgot Password Link */}
          <div className="mb-4 text-right">
            <Link href="/forgot-password" className="text-sm text-teal-600 hover:underline">
              Forgot password?
            </Link>
          </div>

          {/* Login Button */}
          <button
            onClick={onLogin}
            disabled={buttonDisabled || loading}
            className={`w-full p-3 cursor-pointer rounded-lg font-bold text-white transition duration-300 ${
              buttonDisabled || loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-teal-600 hover:bg-teal-700"
            }`}
          >
            {loading ? "Logging in..." : "Log In"}
          </button>

          {/* Sign Up Link */}
          <p className="text-center text-gray-600 mt-4">
            New to Kayapalat?{" "}
            <Link
              href="/signup"
              className="text-teal-600 hover:text-teal-700 font-semibold"
            >
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
