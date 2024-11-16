"use client";
import Button from "@/components/Button";
import InputField from "@/components/InputField";
import axios, { AxiosError } from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Router } from "next/router";
import React, { useEffect, useState } from "react";
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

  const [buttonDisabled, setButtonDisabled] = useState(true);
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
      const response = await axios.post("/api/login", { email, password });
   
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

  // Check if both email and password are filled to enable the button
  useEffect(() => {
    if (email && password) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [email, password]);

  return (
    <div className="min-h-screen  flex items-center justify-center">
      <div className="w-full sm:max-w-[300px] sm:h-[360px] max-w-[380px] h-[336px]  space-y-6 ">
        <h1 className="text-white text-[64px] font-[600] leading-[80px] text-center underline-from-font decoration-skip-ink-none">
          Sign in
        </h1>

        <form className="space-y-[24px]" onSubmit={onLogin}>
          <InputField
            id="email"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            width="sm:w-[300px] w-[380px]"
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
            width="sm:w-[300px] w-[380px]"
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
            width="sm:w-[300px] w-[380px]"
            height="h-[54px]"
            bgColor="bg-primary"
            hoverColor="hover:bg-green-600"
            className="focus:outline-none focus:ring-2 focus:ring-primary text-base font-bold leading-6 text-center"
          >
            Login
          </Button>
        </form>
        <div className="flex justify-center">
          <Link
            href="/signup"
            className="text-sm text-gray-200 hover:underline focus:outline-none focus:ring-2 focus:ring-primary"
            passHref
          >
            <p>Don't have an account? Sign up</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
