"use client";
import Button from "@/components/Button";
import InputField from "@/components/InputField";
import axios, { AxiosError } from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";

export interface CustomErrorResponse {
  error: string;
}

/**
 * Renders a login form and handles the submission of the form to the server.
 *
 * If the submission is successful, the user is redirected to the homepage.
 * If the submission fails, an error message is displayed.
 *
 * @returns {JSX.Element} - The login form component.
 */
const SignIn = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [rememberMe, setRememberMe] = useState<boolean>(false);

  const router = useRouter();

  const [loading, setLoading] = useState(false);

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

  /**
   * Handles the login form submission.
   *
   * Calls the `/api/login` route with the current email and password. If the
   * request is successful, redirects the user to the homepage. If the request
   * fails, displays an error message.
   *
   * @param {React.FormEvent<HTMLFormElement>} event - The form event.
   * @returns {Promise<void>} - A promise that resolves when the login attempt is
   * complete.
   */
  const onLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validateInput()) {
      return;
    }

    try {
      setLoading(true);
      await axios.post("/api/login", { email, password });

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
    <div className="min-h-[calc(100vh-111px)] flex items-center justify-center  w-[380px] h-[336px] sm:w-[300px] sm:h-[360px] mx-[24px]">
      <div className="w-full space-y-6 ">
        <h1 className="text-white text-[48px] sm:text-[64px] font-[600] leading-[56px] sm:leading-[80px] text-center underline-from-font decoration-skip-ink-none">
          Sign in
        </h1>

        <form className="space-y-[24px]" onSubmit={onLogin}>
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
            {loading ? "Loading..." : "Sign in"}
          </Button>
        </form>
        <div className="flex justify-center">
          <Link
            href="/signup"
            className="text-sm text-gray-200 hover:underline focus:outline-none focus:ring-2 focus:ring-primary"
            passHref
          >
            <p>Don&apos;t have an account? Sign up</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
