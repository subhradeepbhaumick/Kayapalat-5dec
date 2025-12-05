"use client";
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

const AuthPage: React.FC = () => {
  const { login } = useAuth();
  const router = useRouter();

  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [forgotStep, setForgotStep] = useState<'email' | 'otp' | 'password'>('email');

  // Unified login form state: login handles email / phone / user_id
  const [loginData, setLoginData] = useState({
    login: "",
    password: "",
  });

  // Signup form state
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmpassword: "",
    location: "",
  });

  // Forgot password state
  const [forgotData, setForgotData] = useState({
    email: "",
    otp: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  // Error states
  const [loginError, setLoginError] = useState("");
  const [signupError, setSignupError] = useState("");
  const [forgotError, setForgotError] = useState("");

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleSignupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSignupData({ ...signupData, [e.target.name]: e.target.value });
  };

  const handleForgotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForgotData({ ...forgotData, [e.target.name]: e.target.value });
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (forgotStep === 'email') {
      if (!forgotData.email) {
        setForgotError("Email is required.");
        return;
      }
      setForgotError("");
      // Simulate sending OTP
      console.log("Sending OTP to:", forgotData.email);
      setForgotStep('otp');
    } else if (forgotStep === 'otp') {
      if (!forgotData.otp) {
        setForgotError("OTP is required.");
        return;
      }
      setForgotError("");
      // Simulate OTP verification
      console.log("Verifying OTP:", forgotData.otp);
      setForgotStep('password');
    } else if (forgotStep === 'password') {
      if (!forgotData.newPassword || !forgotData.confirmNewPassword) {
        setForgotError("All fields are required.");
        return;
      }
      if (forgotData.newPassword !== forgotData.confirmNewPassword) {
        setForgotError("Password and confirm password do not match.");
        return;
      }
      setForgotError("");
      console.log("New password:", forgotData.newPassword);
      // Reset to login
      setIsForgotPassword(false);
      setForgotStep('email');
      setForgotData({ email: "", otp: "", newPassword: "", confirmNewPassword: "" });
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!loginData.login || !loginData.password) {
      setLoginError("All fields are required.");
      return;
    }

    setLoginError("");

    const success = await login(loginData.login, loginData.password);

    if (success) {
      // Redirect or update UI as needed after successful login
      router.push("/referuser/dashboard_page");
    } else {
      setLoginError("Invalid login credentials.");
    }
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!signupData.name || !signupData.email || !signupData.phone || !signupData.location || !signupData.password || !signupData.confirmpassword) {
      setSignupError("All fields are required.");
      return;
    }

    if (signupData.password !== signupData.confirmpassword) {
      setSignupError("Password and confirm password do not match.");
      return;
    }

    setSignupError("");

    // To be implemented: call signup API
    console.log("Signup data:", signupData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#d7e7d0]">
      <div className="bg-white w-full my-20 max-w-md p-5 rounded-2xl shadow-xl">

        {/* Header */}
        <h2 className="text-3xl font-bold text-center mb-6">
          {isForgotPassword ? "Forgot Password" : isLogin ? "Login" : "Create Account"}
        </h2>

        {isForgotPassword ? (
          /* Forgot Password Form */
          <form onSubmit={handleForgotSubmit}>
            {forgotStep === 'email' && (
              <>
                <div className="mb-4">
                  <label className="text-sm font-medium">Email</label>
                  <input
                    type="email"
                    name="email"
                    className="w-full p-3 border rounded-lg mt-1"
                    onChange={handleForgotChange}
                    value={forgotData.email}
                    required
                  />
                </div>
                <button className="w-full bg-gray-400 hover:bg-gray-200 text-black p-3 rounded-lg text-lg">
                  Send OTP
                </button>
              </>
            )}
            {forgotStep === 'otp' && (
              <>
                <div className="mb-4">
                  <label className="text-sm font-medium">Enter OTP</label>
                  <input
                    type="text"
                    name="otp"
                    className="w-full p-3 border rounded-lg mt-1"
                    onChange={handleForgotChange}
                    value={forgotData.otp}
                    required
                  />
                </div>
                <button className="w-full bg-red-500 hover:bg-red-200 text-white p-3 rounded-lg text-lg">
                  Verify OTP
                </button>
              </>
            )}
            {forgotStep === 'password' && (
              <>
                <div className="mb-4">
                  <label className="text-sm font-medium">New Password</label>
                  <input
                    type="password"
                    name="newPassword"
                    className="w-full p-3 border rounded-lg mt-1"
                    onChange={handleForgotChange}
                    value={forgotData.newPassword}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="text-sm font-medium">Confirm New Password</label>
                  <input
                    type="password"
                    name="confirmNewPassword"
                    className="w-full p-3 border rounded-lg mt-1"
                    onChange={handleForgotChange}
                    value={forgotData.confirmNewPassword}
                    required
                  />
                </div>
                <button className="w-full bg-red-500 hover:bg-red-200 text-white p-3 rounded-lg text-lg">
                  Change Password
                </button>
              </>
            )}
            {forgotError && <p className="text-red-500 text-sm mb-4">{forgotError}</p>}
            <p className="text-center mt-4 text-sm">
              <span
                className="text-red-500 font-semibold cursor-pointer hover:underline"
                onClick={() => {
                  setIsForgotPassword(false);
                  setForgotStep('email');
                  setForgotData({ email: "", otp: "", newPassword: "", confirmNewPassword: "" });
                }}
              >
                Back to Login
              </span>
            </p>
          </form>
        ) : isLogin ? (
          /* Login Form */
          <form onSubmit={handleLoginSubmit}>
            <div className="mb-4">
              <label className="text-sm font-medium">Login (Email / Phone / User ID)</label>
              <input
                type="text"
                name="login"
                className="w-full p-3 border rounded-lg mt-1"
                onChange={handleLoginChange}
                value={loginData.login}
                required
                placeholder="Enter email, phone, or user ID"
              />
            </div>

            <div className="mb-4">
              <label className="text-sm font-medium">Password</label>
              <input
                type="password"
                name="password"
                className="w-full p-3 border rounded-lg mt-1"
                onChange={handleLoginChange}
                value={loginData.password}
                required
              />
            </div>

            {loginError && <p className="text-red-500 text-sm mb-4">{loginError}</p>}

            <button type="submit" className="w-full bg-gray-400 hover:bg-gray-200 text-black p-3 rounded-lg text-lg">
              Login
            </button>

            <p className="text-center mt-4 text-sm">
              <span
                className="text-red-500 font-semibold cursor-pointer hover:underline mr-4"
                onClick={() => setIsForgotPassword(true)}
              >
                Forgot Password?
              </span>
            </p>

            <p className="text-center mt-4 text-sm">
              Don't have an account?{" "}
              <span
                className="text-red-500 font-semibold cursor-pointer hover:underline"
                onClick={() => setIsLogin(false)}
              >
                Sign up
              </span>
            </p>
          </form>
        ) : (
          /* Signup Form */
          <form onSubmit={handleSignupSubmit}>
            <div className="mb-4">
              <label className="text-sm font-medium">Full Name</label>
              <input
                type="text"
                name="name"
                className="w-full p-3 border rounded-lg mt-1"
                onChange={handleSignupChange}
                value={signupData.name}
                required
              />
            </div>

            <div className="mb-4">
              <label className="text-sm font-medium">Email</label>
              <input
                type="email"
                name="email"
                className="w-full p-3 border rounded-lg mt-1"
                onChange={handleSignupChange}
                value={signupData.email}
                required
              />
            </div>

            <div className="mb-4">
              <label className="text-sm font-medium">Phone Number</label>
              <input
                type="text"
                name="phone"
                className="w-full p-3 border rounded-lg mt-1"
                onChange={handleSignupChange}
                value={signupData.phone}
                required
              />
            </div>

            <div className="mb-4">
              <label className="text-sm font-medium">Location</label>
              <input
                type="text"
                name="location"
                className="w-full p-3 border rounded-lg mt-1"
                onChange={handleSignupChange}
                value={signupData.location}
                required
              />
            </div>

            <div className="mb-4">
              <label className="text-sm font-medium">Password</label>
              <input
                type="password"
                name="password"
                className="w-full p-3 border rounded-lg mt-1"
                onChange={handleSignupChange}
                value={signupData.password}
                required
              />
            </div>

            <div className="mb-4">
              <label className="text-sm font-medium">Confirm Password</label>
              <input
                type="password"
                name="confirmpassword"
                className="w-full p-3 border rounded-lg mt-1"
                onChange={handleSignupChange}
                value={signupData.confirmpassword}
                required
              />
            </div>

            {signupError && <p className="text-red-500 text-sm mb-4">{signupError}</p>}

            <button type="submit" className="w-full bg-gray-400 hover:bg-gray-200 text-black p-3 rounded-lg text-lg">
              Sign Up
            </button>

            <p className="text-center mt-4 text-sm">
              Already have an account?{" "}
              <span
                className="text-red-500 font-semibold cursor-pointer hover:underline"
                onClick={() => setIsLogin(true)}
              >
                Login
              </span>
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default AuthPage;
