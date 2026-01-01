"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "./prisma";

/**
 * Get or create user in database from Clerk authentication
 * This syncs Clerk users to our database
 * SERVER ONLY - Do not import in client components
 */
export async function getOrCreateUser() {
  const { userId: clerkUserId } = await auth();

  if (!clerkUserId) {
    return null;
  }

  // Check if user exists in database with Clerk ID
  let user = await prisma.user.findUnique({
    where: { id: clerkUserId },
  });

  // If user doesn't exist, create them
  if (!user) {
    const clerkUser = await currentUser();

    if (!clerkUser) {
      return null;
    }

    // Get primary email from Clerk
    const email =
      clerkUser.emailAddresses.find(
        (e) => e.id === clerkUser.primaryEmailAddressId
      )?.emailAddress || clerkUser.emailAddresses[0]?.emailAddress;

    if (!email) {
      throw new Error("User email not found");
    }

    // Create user in database with Clerk ID
    user = await prisma.user.create({
      data: {
        id: clerkUserId, // Use Clerk ID as primary key
        email: email,
        name: clerkUser.fullName || clerkUser.firstName || email.split("@")[0],
        image: clerkUser.imageUrl,
        emailVerified:
          clerkUser.emailAddresses[0]?.verification?.status === "verified"
            ? new Date()
            : null,
      },
    });
  }

  return user;
}

/**
 * Get authenticated user ID (syncs to DB if needed)
 */
export async function getAuthenticatedUserId(): Promise<string | null> {
  const user = await getOrCreateUser();
  return user?.id || null;
}
