import { useState, useEffect, useRef, useCallback } from "react";
import {
  MessageSquare, Send, Paperclip, AtSign, Clock,
  CornerDownRight, X, FileText, ChevronDown, ChevronUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  fetchComments, addComment,
  type DbComment, type DbAttachment,
} from "@/lib/local-store";
import { useFleetManagers } from "@/lib/fleet-managers-store";
import { fleetManagers } from "@/lib/mock-data";

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

function Avatar({
  initials,
  role,
}: {
  initials: string;
  role: string;
}) {
  const tones: Record<string, string> = {
    "Fleet Manager": "bg-primary/20 text-primary",
    Driver: "bg-success/20 text-success",
    Operations: "bg-info/20 text-info",
    Finance: "bg-warning/20 text-warning",
    Compliance: "bg-purple/20 text-purple",
    Maintenance: "bg-danger/20 text-danger",
  };
  const cls =
    tones[role] ??
    tones[Object.keys(tones).find((k) => role.includes(k)) ?? ""] ??
    "bg-white/10 text-muted-foreground";
  return (
    <span
      className={cn(
        "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-bold",
        cls,
      )}
    >
      {initials}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Mention autocomplete                                                */
/* ------------------------------------------------------------------ */

const ALL_USERS = [
  { name: "Operations Team", role: "Operations", initials: "OT" },
  { name: "Maintenance Team", role: "Maintenance", initials: "MT" },
  { name: "Finance Team", role: "Finance", initials: "FT" },
  { name: "Compliance Team", role: "Compliance", initials: "CT" },
  ...fleetManagers.map((m) => ({
    name: m.name,
    role: "Fleet Manager",
    initials: m.name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase(),
  })),
];

interface MentionDropdownProps {
  query: string;
  onSelect: (name: string) => void;
}
function MentionDropdown({ query, onSelect }: MentionDropdownProps) {
  const filtered = ALL_USERS.filter((u) =>
    u.name.toLowerCase().includes(query.toLowerCase()),
  ).slice(0, 5);
  if (!filtered.length) return null;
  return (
    <div className="absolute bottom-full left-0 z-50 mb-1 w-56 rounded-lg border border-border/60 bg-popover py-1 shadow-xl">
      {filtered.map((u) => (
        <button
          key={u.name}
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            onSelect(u.name);
          }}
          className="flex w-full items-center gap-2 px-3 py-1.5 text-sm hover:bg-white/[0.06]"
        >
          <Avatar initials={u.initials} role={u.role} />
          <div className="flex flex-col items-start">
            <span className="font-medium text-foreground">{u.name}</span>
            <span className="text-[10px] text-muted-foreground">{u.role}</span>
          </div>
        </button>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Single comment card                                                 */
/* ------------------------------------------------------------------ */

interface CommentCardProps {
  comment: DbComment;
  replies: DbComment[];
  onReply: (parentId: string) => void;
  replyingTo: string | null;
}

function CommentCard({ comment, replies, onReply, replyingTo }: CommentCardProps) {
  const [showReplies, setShowReplies] = useState(true);

  function highlightMentions(text: string) {
    const parts = text.split(/(@\w[\w\s]*)/g);
    return parts.map((p, i) =>
      p.startsWith("@") ? (
        <span key={i} className="font-semibold text-primary">
          {p}
        </span>
      ) : (
        p
      ),
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-start gap-2.5">
        <Avatar initials={comment.author_initials} role={comment.author_role} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold text-foreground">
              {comment.author_name}
            </span>
            <span className="text-[10px] font-medium text-muted-foreground">
              {comment.author_role}
            </span>
            <span className="ml-auto text-[10px] text-muted-foreground flex items-center gap-1">
              <Clock className="h-2.5 w-2.5" />
              {relativeTime(comment.created_at)}
            </span>
          </div>
          <div className="mt-1 rounded-xl rounded-tl-sm border border-border/40 bg-white/[0.025] px-3 py-2 text-sm leading-relaxed text-foreground">
            {highlightMentions(comment.body)}
          </div>

          {/* Attachments */}
          {comment.attachments.length > 0 && (
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {comment.attachments.map((a, i) => (
                <a
                  key={i}
                  href={a.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 rounded-md border border-border/40 bg-white/[0.03] px-2 py-1 text-[11px] text-muted-foreground transition-colors hover:text-foreground"
                >
                  <FileText className="h-3 w-3" />
                  {a.name}
                  <span className="text-[10px] opacity-60">{a.size}</span>
                </a>
              ))}
            </div>
          )}

          {/* Reply button */}
          <button
            type="button"
            onClick={() => onReply(replyingTo === comment.id ? "" : comment.id)}
            className="mt-1 flex items-center gap-1 text-[11px] text-muted-foreground transition-colors hover:text-primary"
          >
            <CornerDownRight className="h-3 w-3" />
            {replyingTo === comment.id ? "Cancel reply" : `Reply${replies.length > 0 ? ` (${replies.length})` : ""}`}
          </button>
        </div>
      </div>

      {/* Replies */}
      {replies.length > 0 && (
        <div className="ml-10 flex flex-col gap-2 border-l border-border/40 pl-3">
          <button
            type="button"
            onClick={() => setShowReplies((v) => !v)}
            className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground"
          >
            {showReplies ? (
              <ChevronUp className="h-3 w-3" />
            ) : (
              <ChevronDown className="h-3 w-3" />
            )}
            {showReplies ? "Hide" : "Show"} {replies.length} repl{replies.length === 1 ? "y" : "ies"}
          </button>
          {showReplies &&
            replies.map((r) => (
              <div key={r.id} className="flex items-start gap-2.5">
                <Avatar initials={r.author_initials} role={r.author_role} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-foreground">{r.author_name}</span>
                    <span className="text-[10px] text-muted-foreground">{r.author_role}</span>
                    <span className="ml-auto text-[10px] text-muted-foreground">
                      {relativeTime(r.created_at)}
                    </span>
                  </div>
                  <div className="mt-1 rounded-xl rounded-tl-sm border border-border/40 bg-white/[0.025] px-3 py-2 text-sm leading-relaxed text-foreground">
                    {highlightMentions(r.body)}
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Compose box                                                         */
/* ------------------------------------------------------------------ */

const CURRENT_USER = {
  name: "Adeleke Oladipo",
  role: "Fleet Manager",
  initials: "AO",
};

interface ComposeProps {
  onSubmit: (body: string, mentions: string[], parentId?: string) => Promise<void>;
  replyingToName?: string;
  onCancelReply?: () => void;
  placeholder?: string;
}

function ComposeBox({
  onSubmit,
  replyingToName,
  onCancelReply,
  placeholder = "Add a note, @mention a colleague…",
}: ComposeProps) {
  const [body, setBody] = useState("");
  const [mentionQuery, setMentionQuery] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function handleInput(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const val = e.target.value;
    setBody(val);
    const cursor = e.target.selectionStart;
    const beforeCursor = val.slice(0, cursor);
    const match = beforeCursor.match(/@([\w\s]*)$/);
    setMentionQuery(match ? match[1] : null);
  }

  function insertMention(name: string) {
    if (!textareaRef.current) return;
    const cursor = textareaRef.current.selectionStart;
    const beforeCursor = body.slice(0, cursor);
    const afterCursor = body.slice(cursor);
    const atIdx = beforeCursor.lastIndexOf("@");
    const newBody = beforeCursor.slice(0, atIdx) + `@${name} ` + afterCursor;
    setBody(newBody);
    setMentionQuery(null);
    setTimeout(() => textareaRef.current?.focus(), 0);
  }

  async function handleSubmit() {
    const trimmed = body.trim();
    if (!trimmed) return;
    const mentions = (trimmed.match(/@([\w\s]+)/g) ?? []).map((m) => m.slice(1).trim());
    setSubmitting(true);
    try {
      await onSubmit(trimmed, mentions);
      setBody("");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      {replyingToName && (
        <div className="flex items-center gap-1.5 rounded-md bg-primary/10 px-2 py-1 text-[11px] text-primary">
          <CornerDownRight className="h-3 w-3" />
          Replying to <span className="font-semibold">{replyingToName}</span>
          <button type="button" onClick={onCancelReply} className="ml-auto">
            <X className="h-3 w-3" />
          </button>
        </div>
      )}
      <div className="flex items-start gap-2.5">
        <Avatar initials={CURRENT_USER.initials} role={CURRENT_USER.role} />
        <div className="relative flex-1">
          <textarea
            ref={textareaRef}
            rows={2}
            value={body}
            onChange={handleInput}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleSubmit();
            }}
            placeholder={placeholder}
            className="w-full resize-none rounded-xl border border-border/60 bg-white/[0.03] px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30"
          />
          {mentionQuery !== null && (
            <MentionDropdown query={mentionQuery} onSelect={insertMention} />
          )}
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
          <AtSign className="h-3 w-3" />
          <span>Type @ to mention</span>
          <span className="mx-1">·</span>
          <Paperclip className="h-3 w-3" />
          <span>Attach files</span>
        </div>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!body.trim() || submitting}
          className={cn(
            "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all",
            body.trim() && !submitting
              ? "bg-primary text-primary-foreground hover:bg-primary/90"
              : "cursor-not-allowed bg-white/5 text-muted-foreground",
          )}
        >
          <Send className="h-3 w-3" />
          {submitting ? "Posting…" : "Post"}
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Main CollaborationPanel                                             */
/* ------------------------------------------------------------------ */

export interface CollaborationPanelProps {
  entityType: string;
  entityId: string;
  className?: string;
}

export function CollaborationPanel({
  entityType,
  entityId,
  className,
}: CollaborationPanelProps) {
  const [comments, setComments] = useState<DbComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  const loadComments = useCallback(async () => {
    try {
      const data = await fetchComments(entityType, entityId);
      setComments(data);
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, [entityType, entityId]);

  useEffect(() => {
    void loadComments();
  }, [loadComments]);

  async function handleSubmit(body: string, mentions: string[], parentId?: string) {
    const comment = await addComment({
      entity_type: entityType,
      entity_id: entityId,
      parent_id: parentId ?? null,
      author_name: CURRENT_USER.name,
      author_role: CURRENT_USER.role,
      author_initials: CURRENT_USER.initials,
      body,
      mentions,
      attachments: [],
    });
    setComments((prev) => [...prev, comment]);
    setReplyingTo(null);
  }

  const topLevel = comments.filter((c) => !c.parent_id);
  const getReplies = (parentId: string) =>
    comments.filter((c) => c.parent_id === parentId);

  const replyingToComment = replyingTo
    ? comments.find((c) => c.id === replyingTo)
    : null;

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <div className="flex items-center gap-2">
        <MessageSquare className="h-4 w-4 text-muted-foreground" />
        <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Operational Notes
        </span>
        {comments.length > 0 && (
          <span className="ml-auto rounded-full bg-primary/15 px-2 py-0.5 text-[11px] font-semibold text-primary">
            {comments.length}
          </span>
        )}
      </div>

      {/* Comment thread */}
      {loading ? (
        <div className="py-4 text-center text-xs text-muted-foreground">
          Loading notes…
        </div>
      ) : topLevel.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border/50 py-6 text-center text-xs text-muted-foreground">
          No notes yet. Be the first to add an operational note.
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {topLevel.map((c) => (
            <CommentCard
              key={c.id}
              comment={c}
              replies={getReplies(c.id)}
              onReply={(id) => setReplyingTo(id || null)}
              replyingTo={replyingTo}
            />
          ))}
        </div>
      )}

      {/* Compose */}
      <div className="border-t border-border/40 pt-4">
        <ComposeBox
          onSubmit={(body, mentions) =>
            handleSubmit(body, mentions, replyingTo ?? undefined)
          }
          replyingToName={replyingToComment?.author_name}
          onCancelReply={() => setReplyingTo(null)}
        />
      </div>
    </div>
  );
}
