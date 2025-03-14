"use client";

import Navbar from "@/components/Navbar";
import { ThemesProvider } from "@/components/theme-provider";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const SiteLayout = ({ children }) => {
  return (
    <ThemesProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <Navbar />
      <div className={`bg-blue-50`}>{children}</div>
    </ThemesProvider>
  );
};

export default SiteLayout;
