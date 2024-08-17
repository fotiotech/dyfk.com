'use client';

import React, { useState } from "react";
import { useAuth } from "../UserContext";
import Image from "next/image";
import Link from "next/link";

const Login = () => {
  const [input, setInput] = useState({
    email: "",
    password: "",
  });

  const auth = useAuth();

  async function handleLoginSubmit(e: { preventDefault: () => void }) {
    e.preventDefault();
    if (input.email !== "" || input.password !== "") {
      auth.loginAction(input);
      return;
    }
    alert("Please provide a valid input");
  }

  function HandleInput(e: { target: { name: any; value: any } }) {
    const { name, value } = e.target;
    setInput((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  return (
    <>
      <div className="p-2">
        <Image title="logo" src="/logo.png" width={60} height={30} alt="logo" />
      </div>
      <div
        className={`flex justify-center items-center relative bg-pri w-full mt-8 `}
      >
        <div className=" p-2">
          <h1 className="mt-4 text-2xl text-center font-bold">Login</h1>
          <form onSubmit={handleLoginSubmit} className=" mt-8">
            <div>
              <label htmlFor="email" className="font-semibold">
                Email :
                <input
                  onChange={HandleInput}
                  title="email"
                  type="email"
                  name="email"
                  placeholder="example@gmail.com"
                  aria-describedby="user-email"
                  aria-invalid="false"
                  required
                  className="block bg-gray-500 my-3 px-3 rounded-lg p-1 focus:outline-none border-2 border-thi w-full"
                />
              </label>
              <div id="user-email" className=" sr-only">
                Please enter a valid email
              </div>
            </div>
            <div>
              <label htmlFor="password" className="font-semibold">
                Password :
                <input
                  onChange={HandleInput}
                  title="password"
                  type="password"
                  name="password"
                  aria-describedby="user-password"
                  aria-invalid="false"
                  required
                  className="block bg-gray-500 my-3 px-3 rounded-lg p-1 focus:outline-none border-2 border-thi w-full"
                />
              </label>

              <div id="user-password" className=" sr-only">
                Your password should be more than 6 character
              </div>
            </div>
            <p className="font-semibold">Forgot Password?</p>
            <button
              title="submit"
              type="submit"
              value="Submit"
              className=" block w-full font-medium text-white rounded-lg text-center p-1 bg-thiR my-3"
            >
              Submit
            </button>
          </form>
          <Link href={"/auth/sign_up"}>
            <p>
              Do not have an Account?
              <span className=" font-bold px-1 text-blue-600">Sign Up</span>
            </p>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Login;
