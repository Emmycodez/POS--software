"use client"

import { Poppins } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "../components/ui/toaster";
import { LocationProvider } from "@/providers/LocationProvider"; 


// const poppins = localFont({
//   src: [
//     { path: "/fonts/Poppins-Regular.woff2", weight: "400", style: "normal" },

//     { path: "/fonts/Poppins-SemiBold.woff2", weight: "600", style: "normal" },
//     { path: "/fonts/Poppins-Bold.woff2", weight: "700", style: "normal" },

//     { path: "/fonts/Poppins-Black.woff2", weight: "900", style: "normal" },
//   ],
//   variable: "--font-poppins",
// });

const user = {
  role: 'cashier', // or 'owner'
  assignedLocation: 'loc_123' // only needed for cashiers
}


const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], // You can add any other weights needed
  display: "swap",
});

export const metadata = {
  title: "Inventory Management System | Streamline Your Business Operations",
  description:
    "Efficiently manage your inventory with our advanced Inventory Management System. Track stock levels, automate reordering, and optimize your supply chain for better business performance.",
};

export default function RootLayout({ children }) {
  return (
    <LocationProvider user={user}>
    <html lang="en" suppressHydrationWarning>
      <body className={`${poppins.className} antialiased bg-blue-50`}>
        {children}
        <Toaster />
      </body>
    </html>
    </LocationProvider>
  );
}
