import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcrypt";
import { connectToDB } from "@/utils/database";
import { Business, User } from "@/models/schema";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connectToDB();
        const user = await User.findOne({ email: credentials.email });
        if (!user) throw new Error("Invalid email or password");

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!isPasswordValid) throw new Error("Invalid email or password");

        return {
          id: user?._id.toString(),
          name: user?.name,
          email: user?.email,
          image: user?.image,
          role: user?.role,
          image: user?.image,
          onboarded: user?.onboarded,
          currentBusiness: user?.currentBusiness,
          businesses: user?.businesses,
          assignedLocation: user?.assignedLocation,
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],

  callbacks: {
    async signIn({ user, account, profile }) {
      // Run only for Google provider
      if (account.provider === "google") {
        await connectToDB();

        let existingUser = await User.findOne({ email: user.email });

        if (!existingUser) {
          existingUser = await User.create({
            name: user.name,
            email: user.email,
            image: profile.picture,
            role: "owner", // or default role
          });
        }

        user.id = existingUser?._id.toString();
        user.role = existingUser?.role;
      }

      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user?.id;
        token.role = user?.role;
        token.image = user?.image;
        token.onboarded = user?.onboarded;
        token.currentBusiness = user?.currentBusiness;
        token.businesses = user?.businesses;
        token.assignedLocation = user?.assignedLocation;
        token.selectedLocation = user?.selectedLocation;

      }
      return token;
    },

    async session({ session, token }) {
      await connectToDB();
    
      const existingUser = await User.findById(token.id).lean();
      if (!existingUser) return session;
    
      session.user.id = existingUser._id.toString();
      session.user.role = existingUser.role;
      session.user.image = existingUser.image;
      session.user.onboarded = existingUser.onboarded;
      session.user.currentBusiness = existingUser.currentBusiness?.toString();
      session.user.businesses = existingUser.businesses?.map((b) => b?.toString());
      session.user.assignedLocation = existingUser.assignedLocation?.toString();
      session.user.selectedLocation = existingUser.selectedLocation?.toString() || null;
    
      // ✅ Now fetch the business and its locations
      const business = await Business.findById(existingUser.currentBusiness).populate("locations").lean();
    
      session.user.locations =
        business?.locations?.map((loc) => ({
          id: loc._id.toString(),
          name: loc.name,
        })) || [];
    
      return session;
    }
    
  },

  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/site/signin",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
