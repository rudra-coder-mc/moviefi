"use client";
import Button from "@/components/Button";
import InputField from "@/components/InputField";
import axios, { AxiosError } from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { CustomErrorResponse } from "../login/page";

const SignUp: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  // Basic validation: ensure both email and password are filled
  const validateInput = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isEmailValid = emailRegex.test(email);
    const isPasswordValid = password.length > 0;

    if (!isEmailValid) {
      toast.error("Invalid email format.");
      return false;
    }
    if (!isPasswordValid) {
      toast.error("Password cannot be empty.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateInput()) {
      return;
    }

    try {
      setLoading(true);
      await axios.post("/api/signup", {
        email,
        password,
        username,
      });

      toast.success("Login successful!");
      router.push("/");
    } catch (e) {
      const error = e as AxiosError<CustomErrorResponse>;
      console.error("Login failed", error.message);
      toast.error(
        error?.response?.data?.error || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-111px)]  flex items-center justify-center w-[380px] h-[336px] sm:w-[300px] sm:h-[360px] mx-[24px]">
      <div className="w-full space-y-6 ">
        <h1 className="text-white text-[48px] sm:text-[64px] font-[600] leading-[56px] sm:leading-[80px] text-center underline-from-font decoration-skip-ink-none">
          Sign up
        </h1>

        <form className="space-y-[24px] " onSubmit={handleSubmit}>
          <InputField
            id="username"
            type="text"
            placeholder="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            width="w-full"
            height="h-[45px]"
            bgColor="bg-inputColor"
            className="focus:outline-none focus:ring-2 focus:ring-primary"
          />

          <InputField
            id="email"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            width="w-full"
            height="h-[45px]"
            bgColor="bg-inputColor"
            className="focus:outline-none focus:ring-2 focus:ring-primary"
          />

          <InputField
            id="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            width="w-full"
            height="h-[45px]"
            bgColor="bg-inputColor"
            className="focus:outline-none focus:ring-2 focus:ring-primary"
          />

          <div className="flex items-center justify-center">
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 text-primary bg-inputColor border-gray-300 rounded focus:ring-primary"
            />
            <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-200">
              Remember me
            </label>
          </div>

          <Button
            type="submit"
            width="w-full"
            height="h-[54px]"
            bgColor="bg-primary"
            hoverColor="hover:bg-green-600"
            className="focus:outline-none focus:ring-2 focus:ring-primary text-base font-bold leading-6 text-center"
            disabled={loading}
          >
            {loading ? "Signing up..." : "Sign up"}
          </Button>
        </form>
        <div className="flex justify-center">
          <Link
            href="/login"
            className="text-sm text-gray-200 hover:underline focus:outline-none focus:ring-2 focus:ring-primary"
            passHref
          >
            <p>Already have an account? Log in</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
