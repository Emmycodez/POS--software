import { Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "../components/ui/toaster";



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
    <html lang="en" suppressHydrationWarning>
      <body className={`${poppins.className} antialiased bg-blue-50`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
