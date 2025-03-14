"use client"

import { createSupplier } from "@/actions/serverActions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";
import { CirclePlus } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

// Supplier Schema:
// const supplierSchema = new Schema(
//   {
//     name: { type: String, required: true },
//     contactEmail: { type: String },
//     phone: { type: String },
//     countryCode: { type: String },
//     address: { type: String },
//     website: { type: String },
//   },
//   { timestamps: true }
// );

const formSchema = z.object({
  supplierName: z.string().min(2, {
    message: "Supplier Name must be at least 2 characters"
  }),
  email: z.string.email({message: "Invalid email address entered"}),
  phoneNumber: z.string(),
  countryCode: z.string(),
  address: z.string(),
  website: z.string()
})


const form = useForm({
  resolver: zodResolver(formSchema),
  defaultValues: {
    supplierName: "",
    email: "",
    phoneNumber: "",
    countryCode: "",
    addres:"",
    website: ""
  }
})


async function onSubmit (values) {
  try {
    setIsLoading(true);
    const res = await createSupplier(values);
    console.log("This is the response received from the database:  ", res)
    form.reset();
    setIsOpen(false);
  } catch (error) {
    console.log("Error: ", error.message)
  }finally {
    setIsLoading(false);
    toast({
      title:"SUCCES!!!",
      description: "The supplier has been added successfully "
    })
  }
}
const AddSupplier = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false)
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="text-md">
          <CirclePlus className="w-4 h-4 ml-2" /> Add Supplier
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Supplier</DialogTitle>
          <DialogDescription>
            Put in the details of the supplier below
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8"
          ></form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddSupplier;
