import React, { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";

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
