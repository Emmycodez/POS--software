"use client";

import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { LocationProvider } from "@/providers/LocationProvider";
import { SessionProvider } from "next-auth/react";
import { usePathname } from "next/navigation";
import React from "react";
import UserNav from "./UserNav";
import { ModeToggle } from "@/components/ModeToggle";
import { useMemo } from "react";
import LocationSwitcher from "./LocationSwitcher";
import { LocationStoreProvider } from "@/providers/location-store-provider";

function AuthWrapper({ children, session }) {
  return (
    <LocationProvider user={session?.user || {}}>{children}</LocationProvider>
  );
}

const LayoutClient = ({ children, session, locations }) => {
  const pathname = usePathname();
  const pathSegments = pathname
    .split("/")
    .filter((segment) => segment && segment !== "site");

  const cleanUser = useMemo(
    () => ({
      ...session.user,
      id: session.user.id?.toString(),
      currentBusiness: session.user.currentBusiness?.toString(),
      assignedLocation: session.user.assignedLocation?.toString(),
      businesses: session.user.businesses?.map((b) => b?.toString()),
    }),
    [session?.user]
  );
  return (
    <SessionProvider session={session}>
      <AuthWrapper session={session}>
        <LocationStoreProvider serverSelectedLocation={session?.user?.assignedLocation}>
          <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
              <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 justify-between">
                <div className="flex items-center justify-center">
                  <SidebarTrigger className="-ml-1" />
                  <Separator orientation="vertical" className="mr-2 h-4" />
                  <Breadcrumb>
                    <BreadcrumbList>
                      {pathSegments.map((segment, index) => {
                        const breadcrumbPath = `/site/${pathSegments
                          .slice(0, index + 1)
                          .join("/")}`;
                        const isLast = index === pathSegments.length - 1;

                        return (
                          <React.Fragment key={breadcrumbPath}>
                            <BreadcrumbItem className="hidden md:block">
                              {isLast ? (
                                <span>
                                  {segment.charAt(0).toUpperCase() +
                                    segment.slice(1)}
                                </span>
                              ) : (
                                <BreadcrumbLink href={breadcrumbPath}>
                                  {segment.charAt(0).toUpperCase() +
                                    segment.slice(1)}
                                </BreadcrumbLink>
                              )}
                            </BreadcrumbItem>
                            {!isLast && (
                              <BreadcrumbSeparator className="hidden md:block" />
                            )}
                          </React.Fragment>
                        );
                      })}
                    </BreadcrumbList>
                  </Breadcrumb>
                </div>
                <div className="flex items-center justify-center gap-4">
                  {session?.user?.role === "owner" && (
                    <LocationSwitcher locations={locations || []} />
                  )}
                  {session?.user && <UserNav userData={cleanUser} />}
                  <ModeToggle />
                </div>
              </header>
              <main className="flex flex-1 flex-col gap-4 p-4">{children}</main>
            </SidebarInset>
          </SidebarProvider>
        </LocationStoreProvider>
      </AuthWrapper>
    </SessionProvider>
  );
};

export default LayoutClient;
