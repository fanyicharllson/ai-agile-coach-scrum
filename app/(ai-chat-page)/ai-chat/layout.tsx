import { ChatProvider } from "@/contexts/ChatContext";

export default function AIChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ChatProvider>{children}</ChatProvider>;
}
