import { MessageSquarePlus, History, Trash2, GraduationCap } from "lucide-react";
import pillaiLogo from "@/assets/pillai-logo.png";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

export interface ChatSession {
  id: string;
  title: string;
  createdAt: Date;
  messageCount: number;
}

interface ChatSidebarProps {
  sessions: ChatSession[];
  activeSessionId: string | null;
  onNewChat: () => void;
  onSelectSession: (id: string) => void;
  onDeleteSession: (id: string) => void;
}

export function ChatSidebar({
  sessions,
  activeSessionId,
  onNewChat,
  onSelectSession,
  onDeleteSession,
}: ChatSidebarProps) {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon" className="border-r border-border/50">
      <SidebarHeader className="p-3">
        <div className="flex items-center gap-2.5 px-1">
          <div className="h-8 w-8 rounded-lg overflow-hidden border border-accent/30 bg-background/50 p-0.5 shrink-0 hover-wiggle">
            <img src={pillaiLogo} alt="Pillai University" className="h-full w-full object-contain" />
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-foreground truncate">Pillai University</p>
              <p className="text-[10px] font-mono text-muted-foreground truncate">Knowledge Assistant</p>
            </div>
          )}
        </div>
        <Button
          onClick={onNewChat}
          className="w-full mt-3 rounded-xl bg-primary hover:bg-primary/80 glow-primary transition-all duration-300 hover:scale-[1.02] active:scale-95 gap-2"
          size={collapsed ? "icon" : "default"}
        >
          <MessageSquarePlus className="h-4 w-4" />
          {!collapsed && <span className="font-mono text-xs">New Chat</span>}
        </Button>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          {!collapsed && (
            <SidebarGroupLabel className="text-[10px] font-mono text-muted-foreground/60 uppercase tracking-widest px-3">
              <History className="h-3 w-3 mr-1.5 inline" />
              Chat History
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu>
              {sessions.length === 0 && !collapsed && (
                <p className="text-[11px] text-muted-foreground/40 font-mono px-4 py-6 text-center italic">
                  No conversations yet.<br />Start a new chat!
                </p>
              )}
              {sessions.map((session) => (
                <SidebarMenuItem key={session.id}>
                  <SidebarMenuButton
                    onClick={() => onSelectSession(session.id)}
                    className={`group/item rounded-lg transition-all duration-200 ${
                      activeSessionId === session.id
                        ? "bg-primary/15 text-foreground border border-primary/20"
                        : "hover:bg-secondary/60 text-muted-foreground"
                    }`}
                  >
                    <GraduationCap className="h-4 w-4 shrink-0" />
                    {!collapsed && (
                      <div className="flex-1 min-w-0 flex items-center justify-between">
                        <div className="min-w-0">
                          <p className="text-xs truncate">{session.title}</p>
                          <p className="text-[10px] font-mono text-muted-foreground/50">
                            {session.messageCount} msgs
                          </p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteSession(session.id);
                          }}
                          className="opacity-0 group-hover/item:opacity-100 transition-opacity p-1 rounded hover:bg-destructive/20 hover:text-destructive"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3">
        {!collapsed && (
          <div className="text-[9px] font-mono text-muted-foreground/30 text-center leading-relaxed">
            Dept. of Computer Engg.<br />
            RAG-powered • FastAPI
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
