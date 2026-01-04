import { prisma } from "./prisma";

// Define enum types locally to avoid Prisma client import issues
type Role = "USER" | "ASSISTANT";
type SessionCategory = "SPRINT_PLANNING" | "USER_STORIES" | "RETROSPECTIVE" | "DAILY_STANDUP" | "GENERAL";

const RoleEnum = {
  USER: "USER",
  ASSISTANT: "ASSISTANT",
} as const;

const SessionCategoryEnum = {
  SPRINT_PLANNING: "SPRINT_PLANNING",
  USER_STORIES: "USER_STORIES",
  RETROSPECTIVE: "RETROSPECTIVE",
  DAILY_STANDUP: "DAILY_STANDUP",
  GENERAL: "GENERAL",
} as const;

//? ==================== CACHE UTILITIES ====================

/**
 * Helper to get Prisma Accelerate cache information for debugging
 * Usage: const result = await getUserSessionsWithCacheInfo(userId)
 *        console.log(result.info) // Shows cache hit/miss status
 */
export async function getQueryWithCacheInfo<T>(
  queryFn: () => Promise<T>
): Promise<{ data: T; info: any }> {
  const result = await queryFn();
  return {
    data: result,
    info: (result as any)?.__accelerateInfo || null,
  };
}

//? ==================== SESSION OPERATIONS ====================

/**
 * Create a new chat session
 */
export async function createSession(data: {
  userId?: string;
  title?: string;
  category?: SessionCategory;
}) {
  return await prisma.session.create({
    data: {
      title: data.title || "New Session",
      category: data.category || (SessionCategoryEnum.GENERAL as any),
      userId: data.userId,
    },
    include: {
      messages: true,
      folder: true,
    },
  });
}

/**
 * Get all sessions for a user
 */
export async function getUserSessions(userId?: string) {
  return await prisma.session.findMany({
    where: {
      userId: userId || null,
      isArchived: false,
    },
    include: {
      messages: {
        orderBy: { createdAt: "asc" },
        take: 1, // Get last message for preview
      },
      folder: true,
      _count: {
        select: { messages: true },
      },
    },
    orderBy: [{ isPinned: "desc" }, { updatedAt: "desc" }],
    // Caching disabled - causing stale data issues without cache invalidation
  });
}

/**
 * Get a single session with all messages
 * Uses Prisma Accelerate caching (2 min TTL, 5 min SWR)
 */
export async function getSessionWithMessages(sessionId: string) {
  return await prisma.session.findUnique({
    where: { id: sessionId },
    include: {
      messages: {
        orderBy: { createdAt: "asc" },
      },
      folder: true,
    },
    // cacheStrategy: {
    //   ttl: 120, // Time to live(TTL) Cache for 2 minutes
    //   swr: 300, // Stale-while-revalidate(SWR) for 5 minutes
    // },
  });
}

/**
 * Update session details
 */
export async function updateSession(
  sessionId: string,
  data: {
    title?: string;
    category?: SessionCategory;
    isPinned?: boolean;
    isArchived?: boolean;
    folderId?: string | null;
  }
) {
  return await prisma.session.update({
    where: { id: sessionId },
    data,
  });
}

/**
 * Delete a session (cascades to messages)
 */
export async function deleteSession(sessionId: string) {
  return await prisma.session.delete({
    where: { id: sessionId },
  });
}

/**
 * Search sessions by title or content
 */
export async function searchSessions(query: string, userId?: string) {
  return await prisma.session.findMany({
    where: {
      userId: userId || null,
      isArchived: false,
      OR: [
        { title: { contains: query, mode: "insensitive" } },
        {
          messages: {
            some: {
              content: { contains: query, mode: "insensitive" },
            },
          },
        },
      ],
    },
    include: {
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
      _count: {
        select: { messages: true },
      },
    },
    orderBy: { updatedAt: "desc" },
  });
}

// ==================== MESSAGE OPERATIONS ====================

/**
 * Create a new message in a session
 */
export async function createMessage(data: {
  sessionId: string;
  role: Role;
  content: string;
  metadata?: any;
}) {
  // Create message and update session in a transaction
  return await prisma.$transaction(async (tx) => {
    // Create the message
    const message = await tx.message.create({
      data: {
        sessionId: data.sessionId,
        role: data.role,
        content: data.content,
        metadata: data.metadata,
      },
    });

    // Update session metadata
    await tx.session.update({
      where: { id: data.sessionId },
      data: {
        messageCount: { increment: 1 },
        lastMessageAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return message;
  });
}

/**
 * Get all messages for a session
 * Uses Prisma Accelerate caching (2 min TTL, 5 min SWR)
 */
export async function getSessionMessages(sessionId: string) {
  return await prisma.message.findMany({
    where: { sessionId },
    orderBy: { createdAt: "asc" },
    // cacheStrategy: {
    //   ttl: 120, // Cache for 2 minutes
    //   swr: 300, // Stale-while-revalidate for 5 minutes
    // },
  });
}

/**
 * Update a message (mark as edited)
 */
export async function updateMessage(messageId: string, content: string) {
  return await prisma.message.update({
    where: { id: messageId },
    data: {
      content,
      isEdited: true,
      updatedAt: new Date(),
    },
  });
}

/**
 * Delete a message
 */
export async function deleteMessage(messageId: string) {
  return await prisma.$transaction(async (tx) => {
    // Get message to find session
    const message = await tx.message.findUnique({
      where: { id: messageId },
    });

    if (!message) throw new Error("Message not found");

    // Delete message
    await tx.message.delete({
      where: { id: messageId },
    });

    // Update session message count
    await tx.session.update({
      where: { id: message.sessionId },
      data: {
        messageCount: { decrement: 1 },
        updatedAt: new Date(),
      },
    });
  });
}

/**
 * Create a message pair (user + assistant) in one transaction
 */
export async function createMessagePair(data: {
  sessionId: string;
  userMessage: string;
  assistantMessage: string;
  metadata?: any;
}) {
  return await prisma.$transaction(async (tx) => {
    // Create user message
    const userMsg = await tx.message.create({
      data: {
        sessionId: data.sessionId,
        role: RoleEnum.USER as any,
        content: data.userMessage,
      },
    });

    // Create assistant message
    const assistantMsg = await tx.message.create({
      data: {
        sessionId: data.sessionId,
        role: RoleEnum.ASSISTANT as any,
        content: data.assistantMessage,
        metadata: data.metadata,
      },
    });

    // Update session
    await tx.session.update({
      where: { id: data.sessionId },
      data: {
        messageCount: { increment: 2 },
        lastMessageAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return { userMsg, assistantMsg };
  });
}

// ==================== FOLDER OPERATIONS ====================

/**
 * Create a session folder
 */
export async function createSessionFolder(data: {
  userId: string;
  name: string;
  description?: string;
  color?: string;
}) {
  return await prisma.sessionFolder.create({
    data,
    include: {
      sessions: true,
      _count: {
        select: { sessions: true },
      },
    },
  });
}

/**
 * Get all folders for a user
 */
export async function getUserFolders(userId: string) {
  return await prisma.sessionFolder.findMany({
    where: { userId },
    include: {
      sessions: {
        where: { isArchived: false },
        orderBy: { updatedAt: "desc" },
      },
      _count: {
        select: { sessions: true },
      },
    },
    orderBy: { createdAt: "asc" },
    // Caching disabled - causing stale data issues
  });
}

/**
 * Update a folder
 */
export async function updateFolder(
  folderId: string,
  data: {
    name?: string;
    description?: string;
    color?: string;
  }
) {
  return await prisma.sessionFolder.update({
    where: { id: folderId },
    data,
  });
}

/**
 * Delete a folder (sets sessions' folderId to null)
 */
export async function deleteFolder(folderId: string) {
  return await prisma.sessionFolder.delete({
    where: { id: folderId },
  });
}

// ==================== UTILITY FUNCTIONS ====================

/**
 * Auto-generate session title from first message
 */
export async function generateSessionTitle(sessionId: string) {
  const messages = await prisma.message.findFirst({
    where: {
      sessionId,
      role: RoleEnum.USER as any,
    },
    orderBy: { createdAt: "asc" },
  });

  if (messages) {
    // Take first 50 chars as title
    const title =
      messages.content.slice(0, 50).trim() +
      (messages.content.length > 50 ? "..." : "");

    await prisma.session.update({
      where: { id: sessionId },
      data: { title },
    });

    return title;
  }

  return null;
}

/**
 * Get session statistics
 */
export async function getSessionStats(sessionId: string) {
  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    include: {
      _count: {
        select: { messages: true },
      },
      messages: {
        select: {
          role: true,
          content: true,
        },
      },
    },
  });

  if (!session) return null;

  const userMessages = session.messages.filter((m) => m.role === RoleEnum.USER);
  const assistantMessages = session.messages.filter(
    (m) => m.role === RoleEnum.ASSISTANT
  );

  const totalWords = session.messages.reduce(
    (acc, m) => acc + m.content.split(" ").length,
    0
  );

  return {
    totalMessages: session._count.messages,
    userMessages: userMessages.length,
    assistantMessages: assistantMessages.length,
    totalWords,
    averageMessageLength: Math.round(totalWords / session._count.messages),
    createdAt: session.createdAt,
    lastMessageAt: session.lastMessageAt,
  };
}
