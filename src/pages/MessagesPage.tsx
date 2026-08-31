import { useState } from "react";
import { Mail, Trash2 } from "lucide-react";
import { useMessagesStore } from "@/store/messages";
import { formatDate } from "@/lib/format";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

export function MessagesPage() {
  const messages = useMessagesStore((s) => s.messages);
  const removeMessage = useMessagesStore((s) => s.removeMessage);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const messageToDelete = messages.find((m) => m.id === deleteId) ?? null;

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex items-center gap-2">
        <Mail className="h-6 w-6 text-gold" />
        <h1 className="font-heading text-2xl text-foreground sm:text-3xl">Messages</h1>
      </div>
      <p className="mt-1 text-sm text-muted">
        {messages.length} inquiries submitted through the storefront contact form
      </p>

      {messages.length === 0 ? (
        <div className="mt-10 flex flex-col items-center gap-3 py-16 text-center">
          <Mail className="h-8 w-8 text-muted" />
          <p className="text-muted">No messages yet.</p>
        </div>
      ) : (
        <ul className="mt-6 space-y-3">
          {messages.map((m) => (
            <li key={m.id} className="border border-white/10 bg-white/[0.03] p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm text-foreground">
                    {m.name} <span className="text-muted">· {m.email}</span>
                  </p>
                  <p className="mt-1 text-xs text-muted">{formatDate(m.createdAt)}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setDeleteId(m.id)}
                  className="text-muted hover:text-red-400"
                  aria-label="Delete message"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <p className="mt-3 text-sm text-muted">{m.message}</p>
            </li>
          ))}
        </ul>
      )}

      <ConfirmDialog
        open={!!messageToDelete}
        title="Delete message"
        description={`Delete the message from "${messageToDelete?.name}"? This can't be undone.`}
        onCancel={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId) removeMessage(deleteId);
          setDeleteId(null);
        }}
      />
    </div>
  );
}
