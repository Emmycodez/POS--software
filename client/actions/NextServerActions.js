"use server";

import { authOptions } from "@/lib/authOptions";
import { Business, User } from "@/models/schema";
import { connectToDB } from "@/utils/database";
import { getServerSession } from "next-auth";

export const handleOnboarding = async (data) => {
  await connectToDB();

  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId) throw new Error("Unauthorized");

  const { businessName, businessType, whatsappNumber, locations } = data;

  // 1.Create the business
  const business = await Business.create({
    name: businessName,
    type: businessType,
    locations,
    owner: userId,
  });

  // 2. Update the user with business info
  const user = await User.findByIdAndUpdate(
    userId,
    {
      $set: {
        whatsappNumber,
        onboarded: true,
        currentBusiness: business._id,
      },
      $push: {
        businesses: business._id,
      },
    },
    { new: true }
  ); // return updated user

  // 3. Optionally update session (depends how your auth setup handles sessions)
  session.user.whatsappNumber = whatsappNumber;
  session.user.currentBusiness = business._id;
  session.user.businesses = [business._id];
  session.user.onboarded = true;

  return { success: true };
};
