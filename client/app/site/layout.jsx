"use client";
// import localFont from "next/font/local";
import Navbar from "@/components/Navbar";
import { ThemesProvider } from "@/components/theme-provider";

import { Poppins } from "next/font/google";

// const poppins = localFont({
//   src: [
//     { path: "/fonts/Poppins-Regular.woff2", weight: "400", style: "normal" },

//     { path: "/fonts/Poppins-SemiBold.woff2", weight: "600", style: "normal" },
//     { path: "/fonts/Poppins-Bold.woff2", weight: "700", style: "normal" },

//     { path: "/fonts/Poppins-Black.woff2", weight: "900", style: "normal" },
//   ],
//   variable: "--font-poppins",
// });
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], // You can add any other weights needed
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
      <div className={`${poppins.className} antialiased`}>
        <Navbar />
        <div className={`bg-blue-50`}>{children}</div>
      </div>
    </ThemesProvider>
  );
};

export default SiteLayout;
