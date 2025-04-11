import { connectToDB } from "@/utils/database";
import {User} from '@/models/schema'
import bcrypt from "bcrypt"
import { NextResponse } from "next/server";

export async function POST (req) {
  try {
    const {email, password, name, role} = await req.json();

    await connectToDB();

    // check if user already exists
    const existingUser = await User.findOne({email});
    if(existingUser) {
      return NextResponse.json({error: "User already exists"}, {status: 400});
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create new user
    const newUser = await User.create({
      email,
      password: hashedPassword,
      name,
      role: role || "owner"
    })

    return NextResponse.json({message: "User registered successfully", user : newUser}, {status : 201});
  } catch (error) {
    console.log("This is the authentication error: ", error)
    return NextResponse.json({error : "Something went wrong"}, {status: 500})
  }
}