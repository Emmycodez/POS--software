import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { Poppins } from "next/font/google";
import { redirect } from "next/navigation";
import LayoutClient from "./_components/layout-client";
import { getLocations } from "@/actions/NextServerActions";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], // You can add any other weights needed
  display: "swap",
});

export default async function layout({ children }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/site/register");
  }

  if (!session.user.onboarded) {
    redirect("/site/onboarding");
  }

  const locations = await getLocations();
  return (
    <div className={`${poppins.className} flex h-screen`}>
      <LayoutClient session={session} locations={locations}>
        {children}
      </LayoutClient>
    </div>
  );
}
