"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Handle login submission
  const onLogin = async () => {
    try {
      setLoading(true);
      const response = await axios.post("/api/users/login", user);
      console.log("Login success", response.data);

      // Show welcome toast
      toast.success("🎉 Welcome back to Kayapalat family!");

      // Redirect to homepage after 2s
      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch (error: any) {
      console.error("Login failed", error.message);
      toast.error(error.response?.data?.message || "Login failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // Disable button if fields are empty
  useEffect(() => {
    if (user.email.length > 0 && user.password.length > 0) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [user]);

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
          {/* Email */}
          <label htmlFor="email" className="mb-1 text-sm text-gray-700">
            Email
          </label>
          <input
            className="p-3 border border-gray-300 rounded-lg mb-4 bg-white text-black focus:outline-none focus:border-teal-500"
            id="email"
            type="email"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            placeholder="Enter email"
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
