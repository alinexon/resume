"use client";

import { showToast, Toaster } from "@/components/shared/toasterlogin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authenticate, isValidEmail, isValidPassword } from "@/lib/auth";
import { Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, FormEvent } from "react";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    // Client-side validation
    if (!isValidEmail(email)) {
      showToast.error("Login Failed", "Please enter a valid email address");
      setIsLoading(false);
      return;
    }

    if (!isValidPassword(password)) {
      showToast.error(
        "Login Failed",
        "Password must be at least 6 characters long"
      );
      setIsLoading(false);
      return;
    }

    // Authenticate
    const result = authenticate({ email, password });

    if (result.success) {
      showToast.success(
        "Login Successful",
        "Welcome! Redirecting to resume..."
      );
      setTimeout(() => {
        router.push("/resume");
      }, 1000);
    } else {
      showToast.error(
        "Login Failed",
        result.error || "Invalid email or password. Please try again."
      );
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6">
      <Toaster />

      {/* Main Container */}
      <div className="w-full max-w-md mx-auto">
        {/* Form Container */}
        <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-200">
          {/* Logo Section */}
          <div className="bg-orange-500 py-6 px-4 flex justify-center">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-white p-1 shadow-lg">
              <Image
                src="/images/logo.png"
                alt="Logo"
                width={100}
                height={100}
                className="w-full h-full object-contain rounded-full"
                priority
                onError={(e) => {
                  // Fallback if image doesn't exist
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>
          </div>

          {/* Form Content */}
          <div className="p-6 sm:p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
                Interactive Resume
              </h1>
              <p className="text-gray-600 text-sm sm:text-base">
                Log in to access your resume.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Field */}
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-700"
                >
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="intern@demo.com"
                    className="pl-10 w-full bg-gray-50 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-orange-500 border-gray-300"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pl-10 pr-10 w-full bg-gray-50 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-orange-500 border-gray-300"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-500 hover:text-gray-700" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-500 hover:text-gray-700" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md cursor-pointer"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="animate-spin h-5 w-5" />
                    <span>Logging in...</span>
                  </div>
                ) : (
                  "Login"
                )}
              </Button>
            </form>
          </div>
        </div>

        {/* Footer Note */}
        <p className="text-center text-gray-500 text-xs mt-6">
          © {new Date().getFullYear()} Interactive Resume. All rights reserved.
        </p>
      </div>
    </div>
  );
}
