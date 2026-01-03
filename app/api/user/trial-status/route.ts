import { getOrCreateUser } from "@/lib/auth";
import { NextResponse } from "next/server";

/**
 * GET: Get user's trial status and remaining messages
 */
export async function GET() {
  try {
    const user = await getOrCreateUser();
    
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized - Please sign in" },
        { status: 401 }
      );
    }

    const remainingMessages = user.isUnlimited 
      ? -1 // Unlimited
      : Math.max(0, user.trialLimit - user.messagesSent);

    return NextResponse.json({
      messagesSent: user.messagesSent,
      trialLimit: user.trialLimit,
      remainingMessages,
      isUnlimited: user.isUnlimited,
      hasReachedLimit: !user.isUnlimited && user.messagesSent >= user.trialLimit
    });
  } catch (error) {
    console.error("Get trial status error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
