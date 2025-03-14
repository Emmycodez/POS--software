"use client";

import React from "react";
import { Button } from "./ui/button";
import { PlusCircle } from "lucide-react";

const handleCreateGroupCall = () => {
  console.log("Create group clicked");
 
};

const CreateGroupButton = () => {
  return (
    <Button asChild onClick={handleCreateGroupCall} className="cursor-pointer">
      <div>
        Create Group
        <PlusCircle />
      </div>
    </Button>
  );
};

export default CreateGroupButton;
