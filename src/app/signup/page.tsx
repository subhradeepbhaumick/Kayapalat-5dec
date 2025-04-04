"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function SignupPage() {
    const router = useRouter();
    const [user, setUser] = useState({
        email: "",
        password: "",
        confirmPassword: "",
        username: "",
        phone: "",
        about: "",
    });
    const [buttonDisabled, setButtonDisabled] = useState(true);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [passwordMismatch, setPasswordMismatch] = useState(false);
    const [passwordTooShort, setPasswordTooShort] = useState(false);
    const [termsAccepted, setTermsAccepted] = useState(false);

    // Error states for validations
    const [emailError, setEmailError] = useState("");
    const [phoneError, setPhoneError] = useState("");
    const [passwordError, setPasswordError] = useState("");

    // Regex patterns for validations
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^\d{10}$/;

    // Check password length and mismatch dynamically
    useEffect(() => {
        setPasswordMismatch(
            user.password !== user.confirmPassword && user.confirmPassword.length > 0
        );
        setPasswordTooShort(user.password.length > 0 && user.password.length < 6);
    }, [user.password, user.confirmPassword]);

    // Dynamic validation while typing
    useEffect(() => {
        validateEmail(user.email);
        validatePhone(user.phone);
        validatePassword(user.password);
    }, [user.email, user.phone, user.password]);

    // Disable button if required fields are empty or terms not accepted
    useEffect(() => {
        if (
            user.email &&
            user.password &&
            user.confirmPassword &&
            user.username &&
            user.phone &&
            !passwordMismatch &&
            !passwordTooShort &&
            termsAccepted &&
            !emailError &&
            !phoneError &&
            !passwordError
        ) {
            setButtonDisabled(false);
        } else {
            setButtonDisabled(true);
        }
    }, [user, passwordMismatch, passwordTooShort, termsAccepted, emailError, phoneError, passwordError]);

    const validateEmail = (email:string) => {
        if (email && !emailPattern.test(email)) {
            setEmailError("Invalid email format.");
        } else {
            setEmailError("");
        }
    };

    const validatePhone = (phone:string) => {
        if (phone && !phonePattern.test(phone)) {
            setPhoneError("Phone number must be 10 digits.");
        } else {
            setPhoneError("");
        }
    };

    const validatePassword = (password:string) => {
        if (password && password.length < 6) {
            setPasswordError("Password must be at least 6 characters.");
        } else {
            setPasswordError("");
        }
    };

    const onSignup = async () => {
        if (!termsAccepted) {
            toast.error("You must accept the terms and conditions.");
            return;
        }

        try {
            setLoading(true);

            const aboutValue =
            user.about.trim() === ""
                ? `Hi, I am ${user.username || "a new user"}. This is my bio.`
                : user.about;

            const response = await axios.post("/api/users/signup", {
                email: user.email,
                password: user.password,
                username: user.username,
                phone: user.phone,
                about: aboutValue
            });
            // console.log("Signup success", response.data);
            // toast.success("Signup successful! Redirecting...");
            toast.success("✅ Verification email sent. Please check your inbox.");
            router.push("/verifyemail");
        } catch (error) {
            if (error instanceof Error) {
                console.error("Signup failed", error.message);
            } else {
                console.error("Signup failed", error);
            }
            if (axios.isAxiosError(error) && error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error("Signup failed. Try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#D2EBD0] sm:bg-[#E8F5E9] transition-all duration-300 p-6 py-25 ">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md border border-gray-200 transition-all duration-300">
                <h1 className="text-2xl font-bold text-center mb-4 text-teal-700">
                    {loading ? "Processing..." : "Create Your Account"}
                </h1>
                <p className="text-gray-600 text-center mb-6">
                    Join Kayapalat and explore the best experience!
                </p>

                <div className="flex flex-col">
                    {/* Username */}
                    <label htmlFor="username" className="mb-1 text-sm text-gray-700">
                        Username <span className="text-red-500">*</span>
                    </label>
                    <input
                        className="p-3 border border-gray-300 rounded-lg mb-4 bg-white text-black focus:outline-none focus:border-teal-500"
                        id="username"
                        type="text"
                        value={user.username}
                        onChange={(e) => setUser({ ...user, username: e.target.value })}
                        placeholder="Enter username"
                    />

                    {/* Email */}
                    <label htmlFor="email" className="mb-1 text-sm text-gray-700">
                        Email <span className="text-red-500">*</span>
                    </label>
                    <input
                        className={`p-3 border ${emailError ? "border-red-500" : "border-gray-300"} rounded-lg mb-4 bg-white text-black focus:outline-none focus:border-teal-500`}
                        id="email"
                        type="email"
                        value={user.email}
                        onChange={(e) => setUser({ ...user, email: e.target.value })}
                        placeholder="Enter email"
                    />
                    {emailError && <p className="text-red-500 text-sm mb-4">{emailError}</p>}

                    {/* Phone Number */}
                    <label htmlFor="phone" className="mb-1 text-sm text-gray-700">
                        Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                        className={`p-3 border ${phoneError ? "border-red-500" : "border-gray-300"} rounded-lg mb-4 bg-white text-black focus:outline-none focus:border-teal-500`}
                        id="phone"
                        type="tel"
                        value={user.phone}
                        onChange={(e) => setUser({ ...user, phone: e.target.value })}
                        placeholder="Enter phone number"
                    />
                    {phoneError && <p className="text-red-500 text-sm mb-4">{phoneError}</p>}

                    {/* Password */}
                    <label htmlFor="password" className="mb-1 text-sm text-gray-700">
                        Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative mb-4">
                        <input
                            className={`p-3 border ${
                                passwordError ? "border-red-500" : "border-gray-300"
                            } rounded-lg w-full bg-white text-black focus:outline-none focus:border-teal-500`}
                            id="password"
                            type={showPassword ? "text" : "password"}
                            value={user.password}
                            onChange={(e) => setUser({ ...user, password: e.target.value })}
                            placeholder="Enter password"
                        />
                        <button
                            type="button"
                            className="absolute cursor-pointer inset-y-0 right-3 flex items-center text-sm text-gray-600 hover:text-teal-500"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? "🙈" : "👁️"}
                        </button>
                        <div className="h-1">
                            {passwordError && (
                                <p className="text-red-500 text-sm mt-1 mb-4">{passwordError}</p>
                            )}
                        </div>
                    </div>

                    {/* Confirm Password */}
                    <label htmlFor="confirmPassword" className="mb-1 text-sm text-gray-700">
                        Re-enter Password <span className="text-red-500">*</span>
                    </label>
                    <input
                        className={`p-3 border ${
                            passwordMismatch ? "border-red-500" : "border-gray-300"
                        } rounded-lg mb-4 bg-white text-black focus:outline-none focus:border-teal-500`}
                        id="confirmPassword"
                        type="password"
                        value={user.confirmPassword}
                        onChange={(e) =>
                            setUser({ ...user, confirmPassword: e.target.value })
                        }
                        placeholder="Re-enter password"
                    />
                    {passwordMismatch && (
                        <p className="text-red-500 text-sm mb-4">Passwords do not match!</p>
                    )}

                    {/* About Yourself (Optional) */}
                    <label htmlFor="about" className="mb-1 text-sm text-gray-700">
                        Tell us something about yourself (Optional)
                    </label>
                    <textarea
                        className="p-3 border border-gray-300 rounded-lg mb-4 bg-white text-black focus:outline-none focus:border-teal-500"
                        id="about"
                        value={user.about}
                        onChange={(e) => setUser({ ...user, about: e.target.value })}
                        placeholder="Share a little about yourself..."
                        rows={3}
                    />

                    {/* Terms and Conditions */}
                    <div className="flex items-center mb-4">
                        <input
                            type="checkbox"
                            id="terms"
                            checked={termsAccepted}
                            onChange={() => setTermsAccepted(!termsAccepted)}
                            className="w-5 h-5 mr-2 cursor-pointer"
                        />
                        <label
                            htmlFor="terms"
                            className="text-sm text-gray-700 cursor-pointer"
                        >
                            I accept the {" "}
                            <Link
                                href="/terms"
                                className="text-teal-600 hover:text-teal-700 font-semibold"
                            >
                                Terms & Conditions
                            </Link>
                          <span className="text-red-500">*</span>
                        </label>
                    </div>

                    {/* Submit Button */}
                    <button
                        onClick={onSignup}
                        disabled={buttonDisabled || loading}
                        className={`w-full p-3 rounded-lg font-bold text-white transition duration-300 ${
                            buttonDisabled || loading
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-teal-600 hover:bg-teal-700"
                        }`}
                    >
                        {loading ? "Signing Up..." : "Sign Up"}
                    </button>

                    <p className="text-center text-gray-600 mt-4">
                        Already have an account? {" "}
                        <Link
                            href="/login"
                            className="text-teal-600 hover:text-teal-700 font-semibold"
                        >
                            Log in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
