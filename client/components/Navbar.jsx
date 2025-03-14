"use client";

import React, { useState } from "react";
import { ModeToggle } from "./ModeToggle";
import Image from "next/image";
import { logo } from "@/images";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  // Hide Navbar on specific routes
  if (pathname.includes("/site/dashboard")) return null;

  const navItems = [
    { href: "/site/useCases", label: "Use Cases" },
    { href: "/site/Demo", label: "Demo" },
    { href: "/site/pricing", label: "Pricing" },
    { href: "/site/demo", label: "Try It" },
    { href: "/site/faq", label: "FAQ" },
  ];

  return (
    <nav className="border-b px-4">
      <div className="flex h-16 items-center px-4 justify-between">
        {/* Logo Section */}
        <div className="">
          <Link href="/" className="flex items-center">
            <Image src={logo} alt="GroupGuard" className="w-[40px] h-[40px]" />
            <span className="font-bold text-xl">GroupShepherd</span>
          </Link>
        </div>

        {/* Navigation Links Section */}
        <div className="hidden lg:flex items-center justify-center font-semibold  text-lg">
          <NavigationMenu>
            <NavigationMenuList className="gap-12">
              {navItems.map((item) => (
                <NavigationMenuItem key={item.href}>
                  <NavigationMenuLink asChild>
                    <Link href={item.href}>{item.label}</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link href="/pricing" passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Pricing
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/faq" passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  FAQ
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/faq" passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  FAQ
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu> */}

        {/* User Actions Section */}
        <div className="flex items-center space-x-4 ">
          <ModeToggle />
          <Avatar className="hidden md:block">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>

          {/* Mobile Menu Toggle Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>
      {/* mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 w-[200px] h-[400px] bg-background rounded-md border-2 border-primary">
          {/* Backdrop */}
          <div
            className="absolute inset-0"
            onClick={() => setIsMenuOpen(false)}
          />

          {/* Menu Content */}
          <div className="relative z-10 flex flex-col items-start p-6 space-y-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block hover:bg-gray-200 px-3 py-2 rounded-md text-lg font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
