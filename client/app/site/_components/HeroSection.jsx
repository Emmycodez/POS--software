import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon, ArrowRightToLine } from "lucide-react";
import Link from "next/link";
import React from "react";

const HeroSection = () => {
  return (
    <section className="bg-background py-15 sm:py-32">
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center relative">
          <h1 className="text-4xl font-extrabold tracking-tight text-primary sm:text-5xl md:text-6xl lg:text-7xl">
            <span className="text-foreground">The easiest way to manage</span>{" "}
            <br />
            <span className="text-primary">
              Inventory and Transactions For your
              <span className="underline ml-4">business</span>
            </span>
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-xl sm:text-2xl text-muted-foreground">
            Streamline your business operations with our comprehensive inventory
            management and point-of-sale solution. Perfect for{" "}
            <span className="font-semibold underline">
              pharmacies, supermarkets, and local businesses
            </span>{" "}
            🚀
          </p>
          <div className="mt-10 flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 items-center">
            <Button
              size="lg"
              className="text-lg w-full sm:w-auto bg-blue-700 hover:bg-blue-600"
              asChild
            >
              <Link
                href="/site/register"
                className="flex items-center justify-center"
              >
                Get Started
                <ArrowRightToLine className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg w-full sm:w-auto bg-gray-900 text-white"
              asChild
            >
              <Link
                href="/site/signin"
                className="flex items-center justify-center"
              >
                Sign In
                <ArrowRightIcon className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center mt-[50px]">
        <Badge className="bg-gradient-to-r from-blue-500 to-pink-500 hover:from-blue-600 hover:to-pink-600 text-white border-0  py-2 px-4 rounded-full w-auto text-md md:text-xl sm:text-sm text-center">
          Free For your first 30 days of Use✨
        </Badge>
      </div>
    </section>
  );
};

export default HeroSection;
