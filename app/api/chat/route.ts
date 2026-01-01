import { getOrCreateUser } from "@/lib/auth";
import {
  createMessagePair,
  getSessionMessages,
  generateSessionTitle,
  getSessionWithMessages,
  createSession,
} from "@/lib/db-operation";
import { NextRequest, NextResponse } from "next/server";


/**
 * POST: Send a message and get AI response
 */
export async function POST(request: NextRequest) {
  try {
    // Get or create user in database (syncs Clerk user)
    const user = await getOrCreateUser();
    
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized - Please sign in" },
        { status: 401 }
      );
    }

    const { message, sessionId } = await request.json();

    if (!message || !sessionId) {
      return NextResponse.json(
        { error: "Message and sessionId are required" },
        { status: 400 }
      );
    }

    // ==================== SESSION VALIDATION ====================
    // Check if session exists (could have been deleted)
    const existingSession = await getSessionWithMessages(sessionId);
    let actualSessionId = sessionId;
    let isNewSession = false;

    if (!existingSession) {
      // Session was deleted - create a new one
      console.log(`Session ${sessionId} not found. Creating new session...`);
      const newSession = await createSession({
        userId: user.id,
        title: "New Session",
      });
      actualSessionId = newSession.id;
      isNewSession = true;
    }

    // ==================== GEMINI API INTEGRATION ====================
    // Uncomment and configure when ready to use Gemini API

    let aiResponse: string;

    if (process.env.GEMINI_API_KEY) {
      try {
        const { GoogleGenerativeAI } = require("@google/generative-ai");
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

        const prompt = `You are an expert Agile and Scrum coach helping teams and students learn Agile practices.
        Be helpful, concise, and provide actionable advice.

        User question: ${message}`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        aiResponse = response.text();
      } catch (apiError) {
        console.error("Gemini API error:", apiError);
        aiResponse =
          "I'm having trouble connecting to my knowledge base. Please try again in a moment or contact Charllson.";
      }
    } else {
      // Mock response for development
      aiResponse = `I'd be happy to help you with that! As your Agile Coach, I can guide you through creating a strong approach to: "${message}". 

Here's what I recommend:

1. **Start with clarity** - Ensure everyone understands the goal
2. **Break it down** - Divide into manageable user stories
3. **Set clear acceptance criteria** - Know when you're done
4. **Plan incrementally** - Focus on delivering value early

Would you like me to elaborate on any of these points?`;
    }

    // ==================== SAVE TO DATABASE ====================
    // Save both user message and assistant response
    const { userMsg, assistantMsg } = await createMessagePair({
      sessionId: actualSessionId,
      userMessage: message,
      assistantMessage: aiResponse,
      metadata: {
        model: "gemini-2.5-flash-lite",
        userId: user.id,
      },
    });

    // Auto-generate session title if it's the first message
    const messageCount = await getSessionMessages(actualSessionId);
    if (messageCount.length === 2) {
      // First exchange - generate title
      await generateSessionTitle(actualSessionId);
    }

    return NextResponse.json({
      message: aiResponse,
      sessionId: actualSessionId,
      messageId: assistantMsg.id,
      userMessageId: userMsg.id,
      isNewSession, // Flag to indicate if a new session was created
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

/**
 * GET: Retrieve chat history for a session
 */
export async function GET(request: NextRequest) {
  try {
    // Get or create user in database
    const user = await getOrCreateUser();
    
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized - Please sign in" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("sessionId");

    if (!sessionId) {
      return NextResponse.json(
        { error: "sessionId is required" },
        { status: 400 }
      );
    }

    // Fetch messages from database
    const messages = await getSessionMessages(sessionId);

    return NextResponse.json({
      messages: messages.map((msg) => ({
        id: msg.id,
        role: msg.role.toLowerCase(),
        content: msg.content,
        timestamp: msg.createdAt,
        isEdited: msg.isEdited,
        metadata: msg.metadata,
      })),
    });
  } catch (error) {
    console.error("Get messages error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

/**
 * PATCH: Update a message (edit)
 */
export async function PATCH(request: NextRequest) {
  try {
    // Get or create user in database
    const user = await getOrCreateUser();
    
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized - Please sign in" },
        { status: 401 }
      );
    }

    const { messageId, content } = await request.json();

    if (!messageId || !content) {
      return NextResponse.json(
        { error: "messageId and content are required" },
        { status: 400 }
      );
    }

    const { updateMessage } = await import("@/lib/db-operation");
    const updatedMessage = await updateMessage(messageId, content);

    return NextResponse.json({
      message: "Message updated successfully",
      data: updatedMessage,
    });
  } catch (error) {
    console.error("Update message error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * DELETE: Delete a message
 */
export async function DELETE(request: NextRequest) {
  try {
    // Get or create user in database
    const user = await getOrCreateUser();
    
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized - Please sign in" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const messageId = searchParams.get("messageId");

    if (!messageId) {
      return NextResponse.json(
        { error: "messageId is required" },
        { status: 400 }
      );
    }

    const { deleteMessage } = await import("@/lib/db-operation");
    await deleteMessage(messageId);

    return NextResponse.json({
      message: "Message deleted successfully",
    });
  } catch (error) {
    console.error("Delete message error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
