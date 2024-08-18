"use client";

import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

const Sign_Up = () => {
  const navigate = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function SignUpValidation(ev: { preventDefault: () => void }) {
    ev.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:3000/api/users/sign_up",
        {
          username: name,
          email: email,
          password: password,
          role: "customer",
        }
      );
      alert(response.data);
      navigate.push("/auth/login");
    } catch (error) {
      console.log(error);
    }
  }

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
          <h1 className="mt-4 text-2xl text-center font-bold">Sign Up</h1>
          <form onSubmit={SignUpValidation} className=" mt-8">
            <div>
              <label htmlFor="name" className="font-semibold">
                Name :
                <input
                  onChange={(e) => setName(e.target.value)}
                  title="name"
                  type="text"
                  placeholder="john doe"
                  aria-describedby="user-name"
                  aria-invalid="false"
                  required
                  className="block bg-pri my-3 px-3 rounded-lg p-1 
                  focus:outline-none border-2 border-gray-300
                  focus:border-thiR w-full"
                />
              </label>
              <label htmlFor="email" className="font-semibold">
                Email :
                <input
                  onChange={(e) => setEmail(e.target.value)}
                  title="email"
                  type="email"
                  name="email"
                  placeholder="example@gmail.com"
                  aria-describedby="user-email"
                  aria-invalid="false"
                  required
                  className="block bg-pri my-3 px-3 rounded-lg p-1 
                  focus:outline-none border-2 border-gray-300
                  focus:border-thiR w-full"
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
                  onChange={(e) => setPassword(e.target.value)}
                  title="password"
                  type="password"
                  name="password"
                  aria-describedby="user-password"
                  aria-invalid="false"
                  required
                  className="block bg-pri my-3 px-3 rounded-lg p-1 
                  focus:outline-none border-2 border-gray-300
                  focus:border-thiR w-full"
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
          <Link href={"/auth/login"}>
            <p>
              Already have an Account?
              <span className=" font-bold px-1 text-blue-600">Log In</span>
            </p>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Sign_Up;
