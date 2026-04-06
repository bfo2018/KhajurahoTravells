import { useState } from "react";
import { MessageCircle, SendHorizonal, X } from "lucide-react";
import api from "../api/client";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hello, I’m the Khajuraho Roads assistant. Ask about pricing, best cars, booking help, or travel tips for Khajuraho and Panna."
    }
  ]);

  const handleSend = async () => {
    if (!message.trim() || loading) return;

    const nextMessages = [...messages, { role: "user", content: message }];
    setMessages(nextMessages);
    setLoading(true);
    setMessage("");

    try {
      const { data } = await api.post("/chat", { message });
      setMessages([...nextMessages, { role: "assistant", content: data.reply }]);
    } catch {
      setMessages([
        ...nextMessages,
        {
          role: "assistant",
          content:
            "I’m having trouble reaching the travel desk right now. Please use the booking form or WhatsApp button."
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {open ? (
        <div className="w-[22rem] rounded-[28px] border border-white/70 bg-white shadow-soft backdrop-blur">
          <div className="flex items-center justify-between rounded-t-[28px] bg-ink px-5 py-4 text-white">
            <div>
              <p className="font-semibold">Khajuraho AI Travel Desk</p>
              <p className="text-xs text-stone-300">Pricing, routes, cars, and booking help</p>
            </div>
            <button type="button" onClick={() => setOpen(false)}>
              <X size={18} />
            </button>
          </div>
          <div className="h-80 space-y-4 overflow-y-auto px-4 py-4">
            {messages.map((item, index) => (
              <div
                key={`${item.role}-${index}`}
                className={
                  item.role === "assistant"
                    ? "max-w-[85%] rounded-2xl rounded-bl-sm bg-stone-100 px-4 py-3 text-sm text-stone-700"
                    : "ml-auto max-w-[85%] rounded-2xl rounded-br-sm bg-bronze px-4 py-3 text-sm text-white"
                }
              >
                {item.content}
              </div>
            ))}
            {loading && (
              <div className="max-w-[85%] rounded-2xl rounded-bl-sm bg-stone-100 px-4 py-3 text-sm text-stone-700">
                Thinking...
              </div>
            )}
          </div>
          <div className="flex gap-2 border-t border-stone-100 p-4">
            <input
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") handleSend();
              }}
              placeholder="Ask about fares, Innova, Panna trip..."
              className="flex-1 rounded-full border border-stone-200 px-4 py-3 text-sm outline-none focus:border-dune"
            />
            <button type="button" className="primary-button !px-4" onClick={handleSend}>
              <SendHorizonal size={16} />
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex h-16 w-16 items-center justify-center rounded-full bg-ink text-white shadow-soft"
        >
          <MessageCircle size={24} />
        </button>
      )}
    </div>
  );
}
