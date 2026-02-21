"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

const CHAT_POS_STORAGE_KEY = "chatWidgetPos";

type Message = {
  id: string;
  user_id: string;
  nickname: string;
  content: string;
  created_at: string;
};

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [nickname, setNickname] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ startX: number; startY: number; startLeft: number; startTop: number } | null>(null);
  const didDragRef = useRef(false);
  const supabase = createClient();

  // Załaduj zapisaną pozycję
  useEffect(() => {
    try {
      const raw = typeof window !== "undefined" ? localStorage.getItem(CHAT_POS_STORAGE_KEY) : null;
      if (raw) {
        const [x, y] = raw.split(",").map(Number);
        if (Number.isFinite(x) && Number.isFinite(y)) setPosition({ x, y });
      }
    } catch {
      // ignore
    }
  }, []);

  // Zapisz pozycję
  const savePosition = useCallback((pos: { x: number; y: number }) => {
    try {
      localStorage.setItem(CHAT_POS_STORAGE_KEY, `${pos.x},${pos.y}`);
    } catch {
      // ignore
    }
  }, []);

  // Ograniczenie do viewportu (margines 20px)
  const clampPosition = useCallback((x: number, y: number) => {
    if (typeof window === "undefined") return { x, y };
    const margin = 20;
    const maxW = window.innerWidth - 80;
    const maxH = window.innerHeight - 80;
    return {
      x: Math.max(margin, Math.min(x, maxW)),
      y: Math.max(margin, Math.min(y, maxH)),
    };
  }, []);

  // Rozpoczęcie przeciągania
  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const left = position?.x ?? rect.left;
      const top = position?.y ?? rect.top;
      didDragRef.current = false;
      dragRef.current = {
        startX: e.clientX,
        startY: e.clientY,
        startLeft: left,
        startTop: top,
      };
      setPosition({ x: left, y: top });
      (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    },
    [position]
  );

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (!dragRef.current) return;
      didDragRef.current = true;
      const { startX, startY, startLeft, startTop } = dragRef.current;
      const next = clampPosition(
        startLeft + (e.clientX - startX),
        startTop + (e.clientY - startY)
      );
      setPosition(next);
    };
    const onUp = (e: PointerEvent) => {
      if (!dragRef.current) return;
      (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
      const { startLeft, startTop } = dragRef.current;
      const left = clampPosition(
        startLeft + (e.clientX - dragRef.current.startX),
        startTop + (e.clientY - dragRef.current.startY)
      );
      setPosition(left);
      savePosition(left);
      dragRef.current = null;
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, [clampPosition, savePosition]);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        const { data: profile } = await supabase
          .from("profiles")
          .select("nickname")
          .eq("id", user.id)
          .single();
        setNickname(profile?.nickname || null);
      }
    };
    getUser();
  }, [supabase]);

  useEffect(() => {
    const fetchMessages = async () => {
      const { data, error: fetchError } = await supabase
        .from("chat_messages")
        .select("*")
        .order("created_at", { ascending: true })
        .limit(100);
      if (fetchError) {
        console.error("Fetch messages error:", fetchError);
        setError("Nie można załadować czatu. Odśwież stronę.");
      } else if (data) {
        setMessages(data);
      }
    };
    fetchMessages();

    const channel = supabase
      .channel("chat_messages")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "chat_messages" },
        (payload) => {
          const newMsg = payload.new as Message;
          setMessages((prev) => {
            const exists = prev.some((m) => m.id === newMsg.id);
            if (exists) return prev;
            return [...prev, newMsg];
          });
          if (!isOpen && newMsg.user_id !== userId) {
            setUnreadCount((c) => c + 1);
          }
        }
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "chat_messages" },
        (payload) => {
          const old = payload.old as { id?: string };
          if (old?.id) {
            setMessages((prev) => prev.filter((m) => m.id !== old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, isOpen]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      setUnreadCount(0);
    }
  }, [messages, isOpen]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !userId || !nickname) return;

    const messageContent = newMessage.trim();
    setLoading(true);
    setError(null);
    setNewMessage("");
    
    const { data, error: insertError } = await supabase
      .from("chat_messages")
      .insert({
        user_id: userId,
        nickname: nickname,
        content: messageContent,
      })
      .select()
      .single();

    if (insertError) {
      console.error("Chat error:", insertError);
      setError("Nie udało się wysłać wiadomości. Spróbuj ponownie.");
      setNewMessage(messageContent);
    } else if (data) {
      setMessages((prev) => {
        const exists = prev.some((m) => m.id === data.id);
        if (exists) return prev;
        return [...prev, data];
      });
    }
    setLoading(false);
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "2-digit" });
  };

  const positionStyle =
    position === null
      ? {
          bottom: "max(1rem, env(safe-area-inset-bottom))",
          right: "max(1rem, env(safe-area-inset-right))",
        }
      : { left: position.x, top: position.y };

  if (!userId || !nickname) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className="fixed z-[9999]"
      style={positionStyle}
    >
      {isOpen ? (
        <div className="w-[calc(100vw-2rem)] max-w-sm h-[70vh] max-h-[28rem] min-h-[20rem] bg-gray-900 border border-gray-700 rounded-xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-200">
          {/* Header – chwyt do przeciągania */}
          <div
            className="bg-gradient-to-r from-purple-700 to-blue-700 p-3 flex items-center justify-between cursor-move touch-none select-none"
            onPointerDown={handlePointerDown}
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">💬</span>
              <span className="font-bold text-white">Czat</span>
              <span className="text-xs text-purple-200">({messages.length})</span>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(false);
              }}
              className="text-white hover:bg-white/20 rounded p-1 transition-colors cursor-pointer touch-manipulation"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-gray-950">
            {messages.length === 0 && (
              <p className="text-gray-500 text-center text-sm mt-4">
                Brak wiadomości. Napisz pierwszą! 👋
              </p>
            )}
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.user_id === userId ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-lg px-3 py-2 ${
                    msg.user_id === userId
                      ? "bg-purple-700 text-white"
                      : "bg-gray-800 text-gray-100"
                  }`}
                >
                  {msg.user_id !== userId && (
                    <p className="text-xs text-purple-400 font-medium mb-1">{msg.nickname}</p>
                  )}
                  <p className="text-sm break-words">{msg.content}</p>
                </div>
                <span className="text-[10px] text-gray-600 mt-0.5 px-1">
                  {formatTime(msg.created_at)}
                </span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={sendMessage} className="p-2 bg-gray-900 border-t border-gray-800">
            {error && (
              <p className="text-red-400 text-xs mb-2 px-1">Błąd: {error}</p>
            )}
            <div className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Napisz wiadomość..."
                maxLength={500}
                className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
              />
              <button
                type="submit"
                disabled={loading || !newMessage.trim()}
                className="bg-purple-600 hover:bg-purple-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg px-3 py-2 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      ) : (
        <button
          type="button"
          onPointerDown={handlePointerDown}
          onClick={() => {
            if (didDragRef.current) {
              didDragRef.current = false;
              return;
            }
            setIsOpen(true);
          }}
          className="relative w-16 h-16 min-w-[4rem] min-h-[4rem] bg-gradient-to-br from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 rounded-full shadow-xl shadow-purple-900/40 transition-all duration-300 flex items-center justify-center group cursor-move touch-none select-none"
          title="Przeciągnij, aby przenieść. Kliknij, aby otworzyć czat."
        >
          <span className="text-3xl group-hover:scale-110 transition-transform select-none">💬</span>
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-bounce">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>
      )}
    </div>
  );
}
