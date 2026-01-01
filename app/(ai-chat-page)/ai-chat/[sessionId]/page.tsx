import { ChatInterface } from "@/components/chatInterface";

interface PageProps {
  params: Promise<{ sessionId: string }>;
}

export default async function SessionPage({ params }: PageProps) {
  const { sessionId } = await params;

  // Pass sessionId to ChatInterface
  return <ChatInterface sessionId={sessionId} />;
}
