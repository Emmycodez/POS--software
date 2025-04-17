"use client";
// import localFont from "next/font/local";
import Navbar from "@/components/Navbar";
import { ThemesProvider } from "@/components/theme-provider";
import { usePathname } from "next/navigation";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], // You can add any other weights needed
  display: "swap",
});

const SiteLayout = ({ children }) => {
  const pathName = usePathname();
  return (
    <ThemesProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <div className={`${poppins.className} antialiased`}>
        {pathName !== "/site" ? "" : <Navbar />}

        <div>{children}</div>
      </div>
    </ThemesProvider>
  );
};

export default SiteLayout;
