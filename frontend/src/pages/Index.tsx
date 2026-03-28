import { useState, useRef, useEffect, useCallback } from "react";
import { Send, Zap, BookOpen, GraduationCap, Atom, Binary, BrainCircuit, Dna, FlaskConical, Cpu, Paperclip, X, FileText, Image as ImageIcon, Upload, Copy, Check, Wifi, WifiOff, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ChatSidebar, type ChatSession } from "@/components/ChatSidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { useTypewriter } from "@/hooks/use-typewriter";
import pillaiLogo from "@/assets/pillai-logo.png";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";

const API_URL = "http://127.0.0.1:8000/ask";
const HEALTH_URL = "http://127.0.0.1:8000/health";
const UPLOAD_URL = "http://127.0.0.1:8000/upload";

interface FileAttachment {
  id: string;
  file: File;
  preview?: string;
  type: "image" | "pdf" | "document" | "other";
}

interface Message {
  id: number;
  role: "user" | "ai";
  content: string;
  sources?: string[];
  loading?: boolean;
  isNew?: boolean;
  attachments?: FileAttachment[];
}

interface ChatHistory {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
}

// Floating background icons
const FloatingIcons = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
    {[Atom, Binary, BrainCircuit, Dna, FlaskConical, Cpu].map((Icon, i) => (
      <div
        key={i}
        className="absolute text-muted-foreground/10 animate-float"
        style={{
          left: `${10 + i * 15}%`,
          top: `${15 + (i % 3) * 25}%`,
          animationDelay: `${i * 0.7}s`,
          animationDuration: `${4 + i * 0.5}s`,
        }}
      >
        <Icon className="h-8 w-8" />
      </div>
    ))}
  </div>
);

// Matrix rain column
const MatrixColumn = ({ delay, left }: { delay: number; left: string }) => {
  const chars = "01アイウエオカキクケコ∑∏∫λΔ";
  const text = Array.from({ length: 12 }, () => chars[Math.floor(Math.random() * chars.length)]).join("\n");
  return (
    <div
      className="absolute font-mono text-[10px] text-accent/15 whitespace-pre leading-4 select-none pointer-events-none"
      style={{ left, top: "-100px", animation: `matrix-fall ${6 + delay}s linear infinite`, animationDelay: `${delay}s` }}
    >
      {text}
    </div>
  );
};

// Code block with copy button
const CodeBlock = ({ children, className }: { children?: React.ReactNode; className?: string }) => {
  const [copied, setCopied] = useState(false);
  const codeText = String(children).replace(/\n$/, "");
  const language = className?.replace("language-", "") || "";

  const handleCopy = async () => {
    await navigator.clipboard.writeText(codeText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group/code my-2">
      {language && (
        <div className="absolute top-0 left-0 px-2.5 py-1 text-[10px] font-mono text-muted-foreground/60 bg-secondary/40 rounded-tl-lg rounded-br-lg border-b border-r border-border/20">
          {language}
        </div>
      )}
      <button
        onClick={handleCopy}
        className="absolute top-1.5 right-1.5 p-1.5 rounded-lg bg-secondary/80 border border-border/30 text-muted-foreground hover:text-foreground hover:bg-secondary transition-all duration-200 opacity-0 group-hover/code:opacity-100"
        title="Copy code"
      >
        {copied ? <Check className="h-3.5 w-3.5 text-accent" /> : <Copy className="h-3.5 w-3.5" />}
      </button>
      <pre className="p-3 pt-7 rounded-lg bg-background/60 border border-border/30 overflow-x-auto">
        <code className="font-mono text-xs text-foreground">{codeText}</code>
      </pre>
    </div>
  );
};

// Custom markdown components with code copy support
const markdownComponents: Components = {
  code({ className, children, ...props }) {
    const isInline = !className && typeof children === "string" && !children.includes("\n");
    if (isInline) {
      return (
        <code className="font-mono text-xs bg-background/40 text-accent px-1.5 py-0.5 rounded border border-border/30" {...props}>
          {children}
        </code>
      );
    }
    return <CodeBlock className={className}>{children}</CodeBlock>;
  },
  pre({ children }) {
    return <>{children}</>;
  },
};

// Typewriter-enabled AI message with markdown
const TypewriterMarkdown = ({ text, isNew }: { text: string; isNew?: boolean }) => {
  const { displayed, isDone } = useTypewriter(text, 15, !!isNew);
  return (
    <div className="prose-chat">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>{displayed}</ReactMarkdown>
      {!isDone && <span className="animate-cursor inline-block">&nbsp;</span>}
    </div>
  );
};

// Markdown renderer for completed messages
const MarkdownContent = ({ content }: { content: string }) => (
  <div className="prose-chat">
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>{content}</ReactMarkdown>
  </div>
);

// Loading skeleton for welcome screen
const WelcomeSkeleton = () => (
  <div className="flex flex-col items-center justify-center h-full gap-8 px-4">
    <Skeleton className="h-28 w-28 rounded-3xl bg-secondary/60" />
    <div className="space-y-3 flex flex-col items-center">
      <Skeleton className="h-5 w-32 rounded-full bg-secondary/40" />
      <Skeleton className="h-8 w-72 rounded-lg bg-secondary/50" />
      <Skeleton className="h-4 w-96 rounded-lg bg-secondary/30" />
    </div>
    <div className="flex flex-wrap justify-center gap-2.5 max-w-lg">
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="h-8 w-40 rounded-full bg-secondary/30" />
      ))}
    </div>
    <div className="flex items-center gap-2 mt-2">
      <WifiOff className="h-3.5 w-3.5 text-destructive/60 animate-pulse" />
      <span className="text-xs font-mono text-muted-foreground/50">Connecting to backend...</span>
    </div>
  </div>
);

// Single chat message bubble
const ChatMessage = ({ message }: { message: Message }) => {
  const isUser = message.role === "user";

  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"} animate-in fade-in slide-in-from-bottom-3 duration-500`}>
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border transition-all duration-300 hover-wiggle ${
          isUser ? "bg-primary/20 border-primary/30 glow-primary" : "bg-accent/10 border-accent/20 glow-accent"
        }`}
      >
        {isUser ? <GraduationCap className="h-4 w-4 text-primary" /> : <Zap className="h-4 w-4 text-accent" />}
      </div>
      <div
        className={`max-w-[75%] rounded-2xl px-5 py-3.5 backdrop-blur-sm transition-all duration-300 ${
          isUser
            ? "bg-primary text-primary-foreground rounded-tr-sm shadow-lg shadow-primary/20"
            : "bg-secondary/80 text-secondary-foreground rounded-tl-sm border border-border/50"
        }`}
      >
        {message.loading ? (
          <div className="flex items-center gap-2 py-1">
            <div className="h-2 w-2 rounded-full bg-accent animate-bounce [animation-delay:0ms]" />
            <div className="h-2 w-2 rounded-full bg-accent animate-bounce [animation-delay:150ms]" />
            <div className="h-2 w-2 rounded-full bg-accent animate-bounce [animation-delay:300ms]" />
            <span className="text-xs text-muted-foreground ml-2 font-mono italic animate-cursor pr-1">processing query...</span>
          </div>
        ) : (
          <>
            {/* File attachments */}
            {message.attachments && message.attachments.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {message.attachments.map((att) =>
                  att.type === "image" && att.preview ? (
                    <img
                      key={att.id}
                      src={att.preview}
                      alt={att.file.name}
                      className="max-w-[200px] max-h-[150px] rounded-lg border border-border/30 object-cover"
                    />
                  ) : (
                    <div key={att.id} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-background/30 border border-border/30 text-xs font-mono">
                      {att.type === "pdf" ? <FileText className="h-4 w-4 text-primary" /> : <FileText className="h-4 w-4 text-accent" />}
                      <span className="truncate max-w-[120px]">{att.file.name}</span>
                      <span className="text-muted-foreground/50">{(att.file.size / 1024).toFixed(0)}KB</span>
                    </div>
                  )
                )}
              </div>
            )}
            {/* Message content */}
            {isUser ? (
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
            ) : message.isNew ? (
              <TypewriterMarkdown text={message.content} isNew={message.isNew} />
            ) : (
              <MarkdownContent content={message.content} />
            )}
            {/* Sources */}
            {message.sources && message.sources.length > 0 && (
              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs border-t border-border/30 pt-2.5">
                <BookOpen className="h-3 w-3 text-accent shrink-0" />
                {message.sources.map((src, i) => (
                  <span key={i} className="font-mono text-accent/80 px-2 py-0.5 rounded-full bg-accent/10 border border-accent/20">
                    📄 {src}
                  </span>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

// Welcome screen
const WelcomeScreen = ({ onSuggestionClick, backendStatus }: { onSuggestionClick: (q: string) => void; backendStatus: "online" | "offline" }) => (
  <div className="flex flex-col items-center justify-center h-full gap-8 text-center px-4 relative">
    <FloatingIcons />
    <div className="relative group">
      <div className="h-28 w-28 rounded-3xl bg-gradient-to-br from-primary/20 via-accent/10 to-secondary flex items-center justify-center border border-primary/20 glow-primary transition-all duration-700 group-hover:scale-110 group-hover:rotate-6 animate-float">
        <img src={pillaiLogo} alt="Pillai University" className="h-20 w-20 object-contain drop-shadow-lg" />
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="animate-orbit"><Atom className="h-4 w-4 text-accent/40" /></div>
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="animate-orbit-reverse"><Binary className="h-3 w-3 text-primary/40" /></div>
      </div>
      <div className="absolute -inset-12 rounded-full bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 blur-3xl -z-10 animate-pulse" />
    </div>
    <div className="space-y-3 relative z-10">
      <div className="flex items-center justify-center gap-2 mb-1">
        <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-accent/15 text-accent border border-accent/20 animate-glasses">
          🎓 PILLAI UNIVERSITY
        </span>
      </div>
      <h2 className="text-2xl font-bold text-foreground tracking-tight animate-glitch">
        What do you want to <span className="text-primary">learn</span> today?
      </h2>
      <p className="text-sm text-muted-foreground max-w-md leading-relaxed font-mono">
        {">"} Your nerdy AI study buddy for <span className="text-accent">ML</span>, <span className="text-primary">Deep Learning</span>, <span className="text-accent">NLP</span>, and <span className="text-primary">Pillai University</span> info.
      </p>
    </div>
    <div className="flex flex-wrap justify-center gap-2.5 max-w-lg relative z-10">
      {[
        { icon: "🧠", text: "What is deep learning?" },
        { icon: "💬", text: "Explain NLP basics" },
        { icon: "🏫", text: "Tell me about Pillai University" },
        { icon: "🔗", text: "What is a neural network?" },
        { icon: "📊", text: "Explain backpropagation" },
      ].map((q, i) => (
        <button
          key={q.text}
          onClick={() => onSuggestionClick(q.text)}
          className="text-xs px-4 py-2 rounded-full border border-border/60 text-muted-foreground bg-secondary/40 backdrop-blur-sm hover:bg-primary/10 hover:border-primary/30 hover:text-foreground hover:glow-primary transition-all duration-300 cursor-pointer hover-wiggle animate-in fade-in slide-in-from-bottom-2"
          style={{ animationDelay: `${i * 0.1}s` }}
        >
          <span className="mr-1.5">{q.icon}</span>
          {q.text}
        </button>
      ))}
    </div>
    <div className="flex flex-col items-center gap-2 mt-4 relative z-10">
      <div className="text-[10px] font-mono text-muted-foreground/30">
        [ est. 2024 • Department of Computer Engineering • RAG-powered Knowledge System ]
      </div>
      <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-mono ${
        backendStatus === "online"
          ? "border-accent/30 bg-accent/10 text-accent"
          : "border-destructive/30 bg-destructive/10 text-destructive"
      }`}>
        {backendStatus === "online" ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
        {backendStatus === "online" ? "Backend connected" : "Backend offline — start FastAPI server"}
      </div>
    </div>
  </div>
);

const Index = () => {
  const [chats, setChats] = useState<ChatHistory[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [attachments, setAttachments] = useState<FileAttachment[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [backendStatus, setBackendStatus] = useState<"checking" | "online" | "offline">("checking");
  const [llmStatus, setLlmStatus] = useState<"unknown" | "ok" | "error">("unknown");
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const nextId = useRef(0);
  const dragCounter = useRef(0);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Check backend connectivity on mount
  useEffect(() => {
    const checkBackend = async () => {
      try {
        const res = await fetch(HEALTH_URL, { signal: AbortSignal.timeout(5000) });
        if (!res.ok) {
          setBackendStatus("offline");
          setLlmStatus("unknown");
          return;
        }
        const data = (await res.json()) as { status?: string; llm_ok?: boolean };
        if (data.status === "ok") {
          setBackendStatus("online");
          setLlmStatus(data.llm_ok ? "ok" : "error");
        } else {
          setBackendStatus("offline");
          setLlmStatus("unknown");
        }
      } catch {
        setBackendStatus("offline");
        setLlmStatus("unknown");
      }
    };
    checkBackend();
  }, []);

  const getFileType = (file: File): FileAttachment["type"] => {
    if (file.type.startsWith("image/")) return "image";
    if (file.type === "application/pdf") return "pdf";
    if (file.type.includes("document") || file.type.includes("sheet") || file.type.includes("presentation")) return "document";
    return "other";
  };

  const processFiles = useCallback((files: File[]) => {
    const newAttachments: FileAttachment[] = files.map((file) => {
      const type = getFileType(file);
      const att: FileAttachment = { id: crypto.randomUUID(), file, type };
      if (type === "image") att.preview = URL.createObjectURL(file);
      return att;
    });
    setAttachments((prev) => [...prev, ...newAttachments]);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    processFiles(files);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeAttachment = (id: string) => {
    setAttachments((prev) => {
      const att = prev.find((a) => a.id === id);
      if (att?.preview) URL.revokeObjectURL(att.preview);
      return prev.filter((a) => a.id !== id);
    });
  };

  // Drag & drop handlers
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current++;
    if (e.dataTransfer.types.includes("Files")) {
      setIsDragging(true);
    }
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setIsDragging(false);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    dragCounter.current = 0;
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      processFiles(files);
    }
  }, [processFiles]);

  const activeChat = chats.find((c) => c.id === activeChatId);
  const messages = activeChat?.messages ?? [];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const createNewChat = useCallback(() => {
    const id = crypto.randomUUID();
    const newChat: ChatHistory = { id, title: "New Chat", messages: [], createdAt: new Date() };
    setChats((prev) => [newChat, ...prev]);
    setActiveChatId(id);
    setInput("");
  }, []);

  const sessions: ChatSession[] = chats.map((c) => ({
    id: c.id,
    title: c.title,
    createdAt: c.createdAt,
    messageCount: c.messages.filter((m) => !m.loading).length,
  }));

  const sendQuestion = useCallback(async (question: string, fileAttachments?: FileAttachment[]) => {
    if ((!question.trim() && (!fileAttachments || fileAttachments.length === 0)) || isLoading) return;

    // Create new AbortController for this request
    abortControllerRef.current = new AbortController();

    let chatId = activeChatId;
    if (!chatId) {
      const id = crypto.randomUUID();
      const newChat: ChatHistory = { id, title: "New Chat", messages: [], createdAt: new Date() };
      setChats((prev) => [newChat, ...prev]);
      setActiveChatId(id);
      chatId = id;
    }

    const userMsg: Message = { id: nextId.current++, role: "user", content: question, attachments: fileAttachments };
    const loadingMsg: Message = { id: nextId.current++, role: "ai", content: "", loading: true };

    setChats((prev) =>
      prev.map((c) => {
        if (c.id !== chatId) return c;
        const isFirst = c.messages.length === 0;
        return {
          ...c,
          title: isFirst ? question.slice(0, 40) + (question.length > 40 ? "..." : "") : c.title,
          messages: [...c.messages, userMsg, loadingMsg],
        };
      })
    );
    setInput("");
    setIsLoading(true);

    try {
      // Upload files first if any
      if (fileAttachments && fileAttachments.length > 0) {
        const uploadPromises = fileAttachments.map(async (att) => {
          const formData = new FormData();
          formData.append("file", att.file);
          
          try {
            const uploadRes = await fetch(UPLOAD_URL, {
              method: "POST",
              body: formData,
              signal: abortControllerRef.current?.signal,
            });
            const uploadData = await uploadRes.json();
            return uploadData;
          } catch (err) {
            if (err instanceof Error && err.name === 'AbortError') {
              throw err;
            }
            console.error(`Failed to upload ${att.file.name}:`, err);
            return null;
          }
        });
        
        await Promise.all(uploadPromises);
      }

      // Then ask the question
      const res = await fetch(`${API_URL}?question=${encodeURIComponent(question)}`, {
        signal: abortControllerRef.current?.signal,
      });
      const data = await res.json();
      setChats((prev) =>
        prev.map((c) =>
          c.id !== chatId
            ? c
            : {
                ...c,
                messages: c.messages.map((m) =>
                  m.id === loadingMsg.id
                    ? {
                        ...m,
                        content: data.answer || data.response || "No answer received.",
                        sources: data.sources && data.sources.length > 0 ? data.sources : undefined,
                        loading: false,
                        isNew: true,
                      }
                    : m
                ),
              }
        )
      );
    } catch (error) {
      // Handle abort
      if (error instanceof Error && error.name === 'AbortError') {
        setChats((prev) =>
          prev.map((c) =>
            c.id !== chatId
              ? c
              : {
                  ...c,
                  messages: c.messages.map((m) =>
                    m.id === loadingMsg.id
                      ? { ...m, content: "⏹️ Response stopped by user.", loading: false }
                      : m
                  ),
                }
          )
        );
      } else {
        setChats((prev) =>
          prev.map((c) =>
            c.id !== chatId
              ? c
              : {
                  ...c,
                  messages: c.messages.map((m) =>
                    m.id === loadingMsg.id
                      ? { ...m, content: "⚠️ Could not reach the server. Make sure the FastAPI backend is running on `http://127.0.0.1:8000`.\n\n**To start:**\n```bash\ncd backend\nuvicorn main:app --reload\n```", loading: false }
                      : m
                  ),
                }
          )
        );
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
      inputRef.current?.focus();
    }
  }, [activeChatId, isLoading]);

  const handleStop = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  const handleSend = () => {
    const currentAttachments = attachments.length > 0 ? [...attachments] : undefined;
    setAttachments([]);
    sendQuestion(input.trim(), currentAttachments);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <ChatSidebar
          sessions={sessions}
          activeSessionId={activeChatId}
          onNewChat={createNewChat}
          onSelectSession={setActiveChatId}
          onDeleteSession={(id) => {
            setChats((prev) => prev.filter((c) => c.id !== id));
            if (activeChatId === id) setActiveChatId(null);
          }}
        />

        <div
          className="flex-1 flex flex-col h-screen bg-background grain scanlines relative"
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          {/* Drag overlay */}
          {isDragging && (
            <div className="absolute inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center border-2 border-dashed border-primary/50 rounded-xl m-2 pointer-events-none">
              <div className="flex flex-col items-center gap-3 animate-in fade-in zoom-in duration-200">
                <div className="h-16 w-16 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center glow-primary">
                  <Upload className="h-8 w-8 text-primary" />
                </div>
                <p className="text-sm font-mono text-foreground">Drop files here to attach</p>
                <p className="text-xs font-mono text-muted-foreground">Images, PDFs, documents</p>
              </div>
            </div>
          )}

          {/* Matrix rain */}
          <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
            {Array.from({ length: 8 }).map((_, i) => (
              <MatrixColumn key={i} delay={i * 1.2} left={`${5 + i * 12}%`} />
            ))}
          </div>

          {/* Header */}
          <header className="relative flex items-center gap-3 px-4 py-3 border-b border-border/50 shrink-0 backdrop-blur-md bg-background/80 z-10">
            <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
            <div className="h-8 w-8 rounded-lg overflow-hidden border border-accent/30 hover-wiggle bg-background/50 p-0.5">
              <img src={pillaiLogo} alt="Pillai University" className="h-full w-full object-contain" />
            </div>
            <div className="flex-1">
              <h1 className="text-sm font-bold text-foreground tracking-tight flex items-center gap-2 animate-glitch">
                Micro-LLM Knowledge Assistant
                <span className="text-[10px] font-mono font-normal px-2 py-0.5 rounded-full bg-accent/15 text-accent border border-accent/20">
                  RAG v1
                </span>
              </h1>
              <p className="text-[10px] text-muted-foreground font-mono flex items-center gap-1.5">
                <GraduationCap className="h-3 w-3 text-primary" />
                Pillai University • Dept. of Computer Engineering
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary/60 border border-border/50">
                <FlaskConical className="h-3 w-3 text-accent" />
                <span className="text-[10px] font-mono text-muted-foreground">
                  {llmStatus === "error" ? "FastAPI + ChromaDB (LLM issue)" : "FastAPI + ChromaDB + Ollama"}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className={`h-2 w-2 rounded-full ${backendStatus === "online" ? "bg-accent animate-pulse" : backendStatus === "checking" ? "bg-muted-foreground animate-pulse" : "bg-destructive"}`} />
                <span className={`text-[10px] font-mono ${backendStatus === "online" ? "text-accent" : backendStatus === "checking" ? "text-muted-foreground" : "text-destructive"}`}>
                  {backendStatus === "online" ? "LIVE" : backendStatus === "checking" ? "..." : "OFFLINE"}
                </span>
              </div>
            </div>
          </header>

          {/* Chat Area */}
          <ScrollArea className="flex-1 relative z-[2]">
            <div className="max-w-3xl mx-auto px-4 py-6">
              {messages.length === 0 ? (
                backendStatus === "checking" ? <WelcomeSkeleton /> : <WelcomeScreen onSuggestionClick={sendQuestion} backendStatus={backendStatus} />
              ) : (
                <div className="flex flex-col gap-5">
                  {messages.map((msg) => (
                    <ChatMessage key={msg.id} message={msg} />
                  ))}
                </div>
              )}
              <div ref={bottomRef} />
            </div>
          </ScrollArea>

          {/* Input Area */}
          <div className="border-t border-border/50 shrink-0 backdrop-blur-md bg-background/80 relative z-10">
            <div className="max-w-3xl mx-auto px-4 py-4">
              {/* Attachment preview strip */}
              {attachments.length > 0 && (
                <div className="flex gap-2 mb-3 flex-wrap animate-in fade-in slide-in-from-bottom-2 duration-300">
                  {attachments.map((att) => (
                    <div
                      key={att.id}
                      className="relative group/att flex items-center gap-2 px-3 py-2 rounded-xl bg-secondary/80 border border-border/50 text-xs font-mono animate-in fade-in scale-in duration-200"
                    >
                      {att.type === "image" && att.preview ? (
                        <img src={att.preview} alt={att.file.name} className="h-10 w-10 rounded-lg object-cover" />
                      ) : att.type === "pdf" ? (
                        <FileText className="h-5 w-5 text-primary" />
                      ) : (
                        <FileText className="h-5 w-5 text-accent" />
                      )}
                      <div className="flex flex-col min-w-0">
                        <span className="text-foreground truncate max-w-[100px]">{att.file.name}</span>
                        <span className="text-muted-foreground/50 text-[10px]">{(att.file.size / 1024).toFixed(0)}KB</span>
                      </div>
                      <button
                        onClick={() => removeAttachment(att.id)}
                        className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover/att:opacity-100 transition-opacity hover:scale-110"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-2 items-center">
                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*,.pdf,.doc,.docx,.txt,.csv,.xls,.xlsx,.ppt,.pptx"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                {/* Attach button */}
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isLoading}
                  variant="ghost"
                  className="h-12 w-12 rounded-2xl border border-border/50 bg-secondary/40 hover:bg-primary/10 hover:border-primary/30 shrink-0 transition-all duration-300 hover:scale-105 active:scale-95"
                  size="icon"
                >
                  <Paperclip className="h-4 w-4 text-muted-foreground" />
                </Button>
                <div className="flex-1 relative">
                  <Input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && !isLoading && handleSend()}
                    placeholder="Ask about ML, AI, NLP, or Pillai University..."
                    className="flex-1 bg-secondary/60 border border-border/50 text-foreground placeholder:text-muted-foreground rounded-2xl h-12 px-5 text-sm font-mono focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary/50 transition-all duration-300"
                    disabled={isLoading}
                  />
                </div>
                {isLoading ? (
                  <Button
                    onClick={handleStop}
                    className="h-12 w-12 rounded-2xl bg-destructive hover:bg-destructive/80 shrink-0 transition-all duration-300 hover:scale-105 active:scale-95"
                    size="icon"
                    title="Stop generating"
                  >
                    <Square className="h-4 w-4 fill-current" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleSend}
                    disabled={!input.trim() && attachments.length === 0}
                    className="h-12 w-12 rounded-2xl bg-primary hover:bg-primary/80 shrink-0 glow-primary transition-all duration-300 hover:scale-105 active:scale-95"
                    size="icon"
                    title="Send message"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <p className="text-[10px] text-muted-foreground/50 text-center mt-2 font-mono">
                📎 attach files or drag & drop • press enter to send • 🎓 Pillai University Knowledge System
              </p>
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;
