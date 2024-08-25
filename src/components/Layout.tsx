import React, { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

interface layoutProps {
  children: ReactNode;
}

const Layout = ({ children }: layoutProps) => {
  return (
    <div>
      <Header />
      {children}
      <Footer />
    </div>
  );
};

export default Layout;
