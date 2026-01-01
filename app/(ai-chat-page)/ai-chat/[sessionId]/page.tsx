import { ChatInterface } from "@/components/chatInterface";

interface PageProps {
  params: Promise<{ sessionId: string }>;
}

async function SessionPage({ params }: PageProps) {
  const { sessionId } = await params;
  
  return <ChatInterface sessionId={sessionId} />;
}

export default SessionPage;
