import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";

const SidebarUpgrade = () => {
  const higherPlan = "Pro";
  const higherBound = "100";
  return (
    <Card>
      <CardHeader className="p-4 ">
        <CardTitle className=" text-center mb-2">
          Upgrade to {higherPlan}
        </CardTitle>
        <CardDescription>
          Upgrade to <span className="font-bold text-primary uppercase">{higherPlan}</span> plan to manage up to <span className="font-bold text-primary">{higherBound} members </span> in
          your Paid group and access to Premium Support.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-2.5 p-4">
        <Button
          size="lg"
          className="w-full shadow-none"
        >
          Upgrade
        </Button>
      </CardContent>
    </Card>
  );
};

export default SidebarUpgrade;
