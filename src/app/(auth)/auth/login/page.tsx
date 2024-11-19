"use client";

import Image from "next/image";
import Link from "next/link";
import {
  AtSymbolIcon,
  KeyIcon,
  ExclamationCircleIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";
import SignInWithGoogle from "@/components/auth/sign-in";
import { useFormStatus } from "react-dom";
import { Button } from "@mui/material";
import { authenticate } from "@/app/lib/actions";
import { useFormState } from "react-dom";

const Login = () => {
  const [errorMessage, formAction, isPending] = useFormState(
    authenticate,
    undefined
  );
  return (
    <>
      <Link href={"/"}>
        <Image
          title="logo"
          src="/logo.png"
          width={60}
          height={30}
          alt="logo"
          className="p-2"
        />
      </Link>
      <div
        className={`flex justify-center items-center relative bg-pri w-full mt-8 `}
      >
        <div className=" p-2">
          <h1 className="my-4 text-2xl text-center font-bold">Login</h1>
          <form action={formAction} className="space-y-3">
            <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
              <h1 className={` mb-3 text-2xl`}>Please log in to continue.</h1>
              <div className="w-full">
                <div>
                  <label
                    className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                    htmlFor="email"
                  >
                    Email
                  </label>
                  <div className="relative">
                    <input
                      className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                      id="email"
                      type="email"
                      name="email"
                      placeholder="Enter your email address"
                      required
                    />
                    <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                  </div>
                </div>
                <div className="mt-4">
                  <label
                    className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                    htmlFor="password"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                      id="password"
                      type="password"
                      name="password"
                      placeholder="Enter password"
                      required
                      minLength={6}
                    />
                    <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                  </div>
                </div>
              </div>
              <Button
                type="submit"
                className="mt-4 w-full"
                aria-disabled={isPending}
              >
                Log in{" "}
                <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
              </Button>
              <div
                className="flex h-8 items-end space-x-1"
                aria-live="polite"
                aria-atomic="true"
              >
                {errorMessage && (
                  <>
                    <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                    <p className="text-sm text-red-500">{errorMessage}</p>
                  </>
                )}
              </div>
            </div>
          </form>
          <Link href={"/auth/sign_up"}>
            <p>
              Do not have an Account?
              <span className=" font-bold px-1 text-blue-600">Sign Up</span>
            </p>
          </Link>
          <SignInWithGoogle />
        </div>
      </div>
    </>
  );
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      disabled={pending}
      type="submit"
      className="p-2 w-full my-2 rounded-lg
    bg-thiR border-2 border-gray-200"
    >
      Sign In
    </button>
  );
}

export default Login;
