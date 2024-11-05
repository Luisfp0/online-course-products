"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import { Loader } from "@/components/Loader";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const router = useRouter();

  const { loading: authLoading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.push("/dashboard");
    }
  }, [authLoading, isAuthenticated, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setFormError("");
    setUsernameError(false);
    setPasswordError(false);

    let hasError = false;

    if (username.trim() === "") {
      setFormError((prev) => prev + "Username is required. ");
      setUsernameError(true);
      hasError = true;
    }

    if (password.trim() === "") {
      setFormError((prev) => prev + "Password is required. ");
      setPasswordError(true);
      hasError = true;
    }

    if (hasError) {
      setLoading(false);
      return;
    }

    if (username === "admin" && password === "password") {
      localStorage.setItem("isAuthenticated", "true");
      router.push("/dashboard");
    } else {
      setFormError("Invalid credentials. Please try again.");
    }

    setLoading(false);
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
    if (usernameError) {
      setUsernameError(false);
      setFormError((prev) => prev.replace("Username is required. ", ""));
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (passwordError) {
      setPasswordError(false);
      setFormError((prev) => prev.replace("Password is required. ", ""));
    }
  };

  if (authLoading) {
    return <Loader />;
  }

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="flex items-center justify-center h-screen bg-white">
      <div className="flex flex-col md:flex-row w-full h-full">
        <div className="flex flex-col items-center justify-center w-full md:w-4/5 bg-blue-500 text-white p-8">
          <div className="text-center">
            <Image
              src="/logo_image.webp"
              width={250}
              height={250}
              className="rounded-lg mx-auto"
              alt="logo"
              priority
            />
            <h1 className="mt-4 text-4xl font-bold text-[#283CFA]">
              Online<span className="text-[#55DBAB]">Products</span>Management
            </h1>
            <h3 className="mt-2 text-xl">
              Affordable and quality products here.
            </h3>
          </div>
        </div>

        <div className="flex items-center justify-center w-full md:w-3/5 p-8">
          <div className="flex flex-col w-full max-w-sm text-black">
            <h1 className="mb-8 text-lg font-semibold text-center md:text-left">
              Enter your login credentials.
            </h1>
            <form onSubmit={handleLogin}>
              <div className="flex flex-col mb-4">
                <label htmlFor="username" className="mb-2">
                  Username:
                </label>
                <input
                  id="username"
                  type="text"
                  className={`px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                    usernameError
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                  value={username}
                  onChange={handleUsernameChange}
                />
              </div>
              <div className="flex flex-col mb-6">
                <label htmlFor="password" className="mb-2">
                  Password:
                </label>
                <input
                  id="password"
                  type="password"
                  className={`px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                    passwordError
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                  value={password}
                  onChange={handlePasswordChange}
                />
              </div>
              <button
                className="w-full px-3 py-2 text-white bg-green-500 rounded-md hover:bg-green-600"
                type="submit"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </button>
              <p></p>
              {formError ? (
                <div className="h-4">
                  <p className="text-red-500 text-sm mt-4 text-center">
                    {formError}
                  </p>
                </div>
              ) : (
                <div className="h-8"></div>
              )}
            </form>
            <span className="mt-4 text-blue-500 underline cursor-pointer text-center md:text-left">
              I forgot my password
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
