"use client";
import { useState } from "react";
import { User, Mail, Lock } from "lucide-react"; // ✅ Importing icons from lucide-react

export default function AuthForm({
  type,
  onSubmit,
  isError,
  error,
}: {
  type: "signin" | "signup";
  onSubmit: (data: any) => void;
  isError?: boolean;
  error?: any;
}) {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);

  const errorMessage =
    error?.response?.data?.message ||
    error?.message ||
    "Something went wrong. Please try again.";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (type === "signin") {
      const { email, password } = form;
      onSubmit({ email, password });
    } else {
      onSubmit(form);
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 overflow-hidden">
          <div className="p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Lock className="w-8 h-8 text-white" /> {/* ✅ Lock icon */}
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {type === "signin" ? "Welcome Back" : "Create Account"}
              </h1>
              <p className="text-gray-600 mt-2">
                {type === "signin"
                  ? "Sign in to your account"
                  : "Sign up to get started"}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field - Only for Sign Up */}
              {type === "signup" && (
                <div className="group">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Enter your full name"
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 group-hover:border-gray-400 placeholder-gray-400"
                      value={form.username}
                      onChange={(e) =>
                        setForm({ ...form, username: e.target.value })
                      }
                      required
                    />
                    <div className="absolute inset-y-0 right-3 flex items-center">
                      <User className="w-5 h-5 text-gray-400 group-focus-within:text-blue-500" />
                    </div>
                  </div>
                </div>
              )}

              {/* Email Field */}
              <div className="group">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 group-hover:border-gray-400 placeholder-gray-400"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                  />
                  <div className="absolute inset-y-0 right-3 flex items-center">
                    <Mail className="w-5 h-5 text-gray-400 group-focus-within:text-blue-500" />
                  </div>
                </div>
              </div>

              {/* Password Field */}
              <div className="group">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    placeholder="Enter your password"
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 group-hover:border-gray-400 placeholder-gray-400"
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                    required
                  />
                  <div className="absolute inset-y-0 right-3 flex items-center">
                    <Lock className="w-5 h-5 text-gray-400 group-focus-within:text-blue-500" />
                  </div>
                </div>
              </div>

              {isError && (
                <p className="text-red-600 text-sm mt-2 text-center">
                  {Array.isArray(errorMessage)
                    ? errorMessage.join(", ")
                    : errorMessage}
                </p>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    {type === "signin" ? "Signing In..." : "Creating Account..."}
                  </div>
                ) : type === "signin" ? (
                  "Sign In"
                ) : (
                  "Sign Up"
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="mt-6 text-center">
              <p className="text-gray-600 text-sm">
                {type === "signin"
                  ? "Don't have an account? "
                  : "Already have an account? "}
                <a
                  href={type === "signin" ? "/signup" : "/signin"}
                  className="text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-200"
                >
                  {type === "signin" ? "Sign up" : "Sign in"}
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
