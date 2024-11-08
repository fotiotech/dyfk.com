"use client";

import Image from "next/image";
import Link from "next/link";
import { signin } from "@/app/actions/auth";
import SignInWithGoogle from "@/components/auth/sign-in";
import { useFormState, useFormStatus } from "react-dom";

const Login = () => {
  // const [state, action] = useFormState(signin, undefined);
  // return (
  //   <>
  //     <Link href={"/"}>
  //       <Image
  //         title="logo"
  //         src="/logo.png"
  //         width={60}
  //         height={30}
  //         alt="logo"
  //         className="p-2"
  //       />
  //     </Link>
  //     <div
  //       className={`flex justify-center items-center relative bg-pri w-full mt-8 `}
  //     >
  //       <div className=" p-2">
  //         <h1 className="my-4 text-2xl text-center font-bold">Login</h1>
  //         <form
  //           action={action}
  //           className="flex justify-center 
  //           items-center "
  //         >
  //           <div>
  //             <div>
  //               <label htmlFor="email">Email</label>
  //               <input name="email" type="email" placeholder="Email" />
  //             </div>
  //             {state?.errors?.email && <p>{state.errors.email}</p>}
  //             <div>
  //               <label htmlFor="password">Password</label>
  //               <input title="password" name="password" type="password" />
  //             </div>
  //             {state?.errors?.password && (
  //               <div>
  //                 <p>Password must:</p>
  //                 <ul>
  //                   {state.errors.password.map((error) => (
  //                     <li key={error}>- {error}</li>
  //                   ))}
  //                 </ul>
  //               </div>
  //             )}
  //             <SubmitButton />
  //           </div>
  //         </form>
  //         <Link href={"/auth/sign_up"}>
  //           <p>
  //             Do not have an Account?
  //             <span className=" font-bold px-1 text-blue-600">Sign Up</span>
  //           </p>
  //         </Link>
  //         <SignInWithGoogle />
  //       </div>
  //     </div>
  //   </>
  // );
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
