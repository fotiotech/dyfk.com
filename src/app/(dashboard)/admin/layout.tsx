import { verifySession } from "@/app/lib/dal";
import { AdminLayout } from "../components";
import { redirect } from "next/navigation";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const session = await verifySession();
  // const userRole = session?.role;

  // // If there is no token, redirect to login page
  // if (userRole !== "admin") {
  //   return redirect("/auth/login");
  // }

  return (
    <div>
      <ToastContainer />
      <AdminLayout>{children}</AdminLayout>
    </div>
  );
}
