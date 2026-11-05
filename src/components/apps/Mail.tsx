import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useWindowSize } from "~/hooks/useWindowSize";
import profile from "~/config/profile";
import {
  useMacSurfaces,
  macBlur,
  SideBadge,
  SideRow,
  SideSectionLabel,
  MacToolbar,
  ToolButton,
  SearchField,
  PushButton,
  StatusBar,
} from "./shared/mac";

type Mailbox = "Inbox" | "Sent" | "Drafts";
type MobilePane = "mailboxes" | "list" | "reading";

interface MailMessage {
  id: string;
  mailbox: Mailbox;
  from: string;
  fromEmail: string;
  subject: string;
  preview: string;
  body: string;
  time: string;
  unread?: boolean;
  avatar: string;
}

const WELCOME_MESSAGE: MailMessage = {
  id: "welcome",
  mailbox: "Inbox",
  from: profile.name,
  fromEmail: profile.email,
  subject: "Welcome — let's build something great",
  preview: "Hi there! Thanks for stopping by my portfolio…",
  body: `Hi there!\n\nThanks for stopping by my portfolio. I'm ${profile.name}, a developer who loves crafting delightful, native-feeling experiences for the web.\n\nIf you'd like to get in touch — about a role, a project, or just to say hi — hit Reply or compose a new message. It opens right in your email app.\n\nLooking forward to hearing from you!\n\n— ${profile.name}`,
  time: "9:41 AM",
  unread: true,
  avatar: "A",
};

const ALL_MESSAGES = [WELCOME_MESSAGE];

const MAILBOX_META: Record<Mailbox, { glyph: string; color: string }> = {
  Inbox: { glyph: "i-ph:tray", color: "#0A84FF" },
  Sent: { glyph: "i-ph:paper-plane-tilt", color: "#0A84FF" },
  Drafts: { glyph: "i-ph:note-pencil", color: "#8E8E93" },
};

export default function Mail() {
  const { material, hairline, font } = useMacSurfaces();
  const { winWidth } = useWindowSize();
  const isMobile = winWidth < 768;

  const [activeMailbox, setActiveMailbox] = useState<Mailbox>("Inbox");
  const [selectedId, setSelectedId] = useState<string>(WELCOME_MESSAGE.id);
  const [search, setSearch] = useState("");
  const [mobilePane, setMobilePane] = useState<MobilePane>("reading");
  const [composing, setComposing] = useState(false);
  const [composeTitle, setComposeTitle] = useState("New Message");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [toast, setToast] = useState<string | null>(null);

  const messages = useMemo(() => {
    const inBox = ALL_MESSAGES.filter((m) => m.mailbox === activeMailbox);
    const q = search.trim().toLowerCase();
    if (!q) return inBox;
    return inBox.filter(
      (m) =>
        m.subject.toLowerCase().includes(q) ||
        m.from.toLowerCase().includes(q) ||
        m.preview.toLowerCase().includes(q)
    );
  }, [activeMailbox, search]);

  const activeMsg = ALL_MESSAGES.find((m) => m.id === selectedId) ?? null;
  const unreadCount = ALL_MESSAGES.filter((m) => m.mailbox === "Inbox" && m.unread).length;

  const showToast = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 2000);
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      showToast("Copied");
    } catch {
      showToast(profile.email);
    }
  };

  const openComposeNew = () => {
    setComposeTitle("New Message");
    setSubject("");
    setBody("");
    setComposing(true);
  };

  const openComposeReply = (msg: MailMessage) => {
    setComposeTitle("Reply");
    setSubject(`Re: ${msg.subject}`);
    setBody(`\n\n—\nOn ${msg.time}, ${msg.from} wrote:\n${msg.body}`);
    setComposing(true);
  };

  const openComposeForward = (msg: MailMessage) => {
    setComposeTitle("Forward");
    setSubject(`Fwd: ${msg.subject}`);
    setBody(`\n\n—\nBegin forwarded message:\nFrom: ${msg.from} <${msg.fromEmail}>\nSubject: ${msg.subject}\n\n${msg.body}`);
    setComposing(true);
  };

  const canSend = subject.trim().length > 0 && body.trim().length > 0;

  const sendViaMailto = () => {
    if (!canSend) return;
    window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(subject.trim())}&body=${encodeURIComponent(body.trim())}`;
    setComposing(false);
    showToast("Opening your mail app…");
  };

  const openInGmail = () => {
    if (!canSend) return;
    window.open(
      `https://mail.google.com/mail/?view=cm&to=${encodeURIComponent(profile.email)}&su=${encodeURIComponent(subject.trim())}&body=${encodeURIComponent(body.trim())}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const selectMessage = (id: string) => {
    setSelectedId(id);
    if (isMobile) setMobilePane("reading");
  };

  const selectMailbox = (box: Mailbox) => {
    setActiveMailbox(box);
    setSearch("");
    const first = ALL_MESSAGES.find((m) => m.mailbox === box);
    setSelectedId(first ? first.id : "");
    if (isMobile) setMobilePane("list");
  };

  const mailboxPane = (!isMobile || mobilePane === "mailboxes") && (
    <nav
      aria-label="Mailboxes"
      style={{
        width: isMobile ? "100%" : "188px",
        flexShrink: 0,
        background: material,
        ...macBlur,
        borderRight: hairline,
        display: "flex",
        flexDirection: "column",
        padding: "6px 10px 12px",
      }}
    >
      <SideSectionLabel>Mailboxes</SideSectionLabel>
      {(Object.keys(MAILBOX_META) as Mailbox[]).map((box) => (
        <SideRow
          key={box}
          active={activeMailbox === box}
          onClick={() => selectMailbox(box)}
          badge={<SideBadge glyph={MAILBOX_META[box].glyph} color={MAILBOX_META[box].color} />}
          label={box}
          count={box === "Inbox" ? unreadCount : undefined}
        />
      ))}
      <div style={{ flex: 1 }} />
      <div style={{ padding: "0 2px" }}>
        <PushButton primary onClick={openComposeNew} aria-label="New Message" style={{ width: "100%" }}>
          <span className="i-ph:pencil-simple" style={{ width: "14px", height: "14px" }} aria-hidden />
          New Message
        </PushButton>
      </div>
    </nav>
  );

  const listPane = (!isMobile || mobilePane === "list") && (
    <div
      aria-label="Message list"
      style={{
        width: isMobile ? "100%" : "268px",
        flexShrink: 0,
        borderRight: hairline,
        background: "var(--c-bg)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: "10px 14px 6px",
          fontSize: "20px",
          fontWeight: 700,
          letterSpacing: "-0.02em",
          borderBottom: messages.length > 0 ? hairline : "none",
        }}
      >
        {activeMailbox}
      </div>
      <div style={{ overflowY: "auto", flex: 1 }}>
        {messages.length === 0 && (
          <div style={{ padding: "32px 20px", textAlign: "center", fontSize: "13px", color: "var(--c-text-secondary)" }}>
            {search ? `No messages match “${search}”.` : `No messages in ${activeMailbox}.`}
          </div>
        )}
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            role="button"
            tabIndex={0}
            aria-label={`${msg.subject} from ${msg.from}`}
            aria-current={selectedId === msg.id ? "true" : undefined}
            onClick={() => selectMessage(msg.id)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                selectMessage(msg.id);
              }
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              padding: "10px 14px 10px 24px",
              borderBottom: hairline,
              cursor: "pointer",
              background: selectedId === msg.id ? "rgba(10,132,255,0.12)" : "transparent",
              transition: "background 0.12s ease",
              position: "relative",
              outline: "none",
            }}
            onMouseEnter={(e) => {
              if (selectedId !== msg.id) (e.currentTarget as HTMLElement).style.background = "var(--c-bg-secondary)";
            }}
            onMouseLeave={(e) => {
              if (selectedId !== msg.id) (e.currentTarget as HTMLElement).style.background = "transparent";
            }}
          >
            <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
              <div
                aria-hidden
                style={{
                  width: "38px",
                  height: "38px",
                  borderRadius: "50%",
                  background: msg.unread ? "rgba(10,132,255,0.15)" : "var(--c-bg-tertiary)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "15px",
                  flexShrink: 0,
                  fontWeight: 600,
                  color: msg.unread ? "#0A84FF" : "var(--c-text-secondary)",
                }}
              >
                {msg.avatar}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "6px" }}>
                  <span
                    style={{
                      fontSize: "13px",
                      fontWeight: msg.unread ? 700 : 600,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      flex: 1,
                    }}
                  >
                    {msg.from}
                  </span>
                  <span style={{ fontSize: "11px", color: "var(--c-text-tertiary)", flexShrink: 0 }}>{msg.time}</span>
                </div>
                <div
                  style={{
                    fontSize: "12.5px",
                    color: "var(--c-text-secondary)",
                    fontWeight: msg.unread ? 600 : 400,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    marginTop: "1px",
                  }}
                >
                  {msg.subject}
                </div>
                <div
                  style={{
                    fontSize: "12px",
                    color: "var(--c-text-tertiary)",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    display: "-webkit-box",
                  }}
                >
                  {msg.preview}
                </div>
              </div>
            </div>
            {msg.unread && (
              <div
                aria-hidden
                style={{
                  position: "absolute",
                  left: "9px",
                  top: "22px",
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: "#0A84FF",
                }}
              />
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );

  const readingPane = (!isMobile || mobilePane === "reading") && (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>
      {activeMsg ? (
        <AnimatePresence mode="wait">
          <motion.div
            key={activeMsg.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            style={{ flex: 1, display: "flex", flexDirection: "column", overflowY: "auto", background: "var(--c-bg)" }}
          >
            {/* Message header, like Apple Mail */}
            <div style={{ padding: isMobile ? "14px 16px 0" : "20px 28px 0" }}>
              {isMobile && (
                <button
                  onClick={() => setMobilePane("list")}
                  aria-label="Back to message list"
                  style={{
                    background: "none",
                    border: "none",
                    color: "#0A84FF",
                    fontWeight: 600,
                    fontSize: "13px",
                    cursor: "pointer",
                    padding: "0 0 8px",
                    fontFamily: font,
                  }}
                >
                  ‹ {activeMailbox}
                </button>
              )}
              <h2 style={{ fontSize: "19px", fontWeight: 700, margin: "0 0 10px", letterSpacing: "-0.015em" }}>
                {activeMsg.subject}
              </h2>
              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <div
                  aria-hidden
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    background: "rgba(10,132,255,0.12)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "17px",
                    fontWeight: 600,
                    color: "#0A84FF",
                    flexShrink: 0,
                  }}
                >
                  {activeMsg.avatar}
                </div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontSize: "13.5px", fontWeight: 600 }}>{activeMsg.from}</div>
                  <div style={{ fontSize: "12px", color: "var(--c-text-secondary)" }}>
                    To: {profile.name} · {activeMsg.time}
                  </div>
                </div>
              </div>
              {/* Reply actions */}
              <div style={{ display: "flex", gap: "8px", margin: "14px 0", flexWrap: "wrap" }}>
                <PushButton primary onClick={() => openComposeReply(activeMsg)} aria-label="Reply to this message">
                  <span className="i-ph:arrow-bend-up-left" style={{ width: "14px", height: "14px" }} aria-hidden />
                  Reply
                </PushButton>
                <PushButton onClick={() => openComposeForward(activeMsg)} aria-label="Forward this message">
                  <span className="i-ph:arrow-bend-up-right" style={{ width: "14px", height: "14px" }} aria-hidden />
                  Forward
                </PushButton>
                <PushButton onClick={copyEmail} aria-label="Copy email address">
                  Copy email address
                </PushButton>
              </div>
            </div>
            <div style={{ borderBottom: hairline, margin: "0 0 4px" }} />
            <div
              style={{
                fontSize: "13.5px",
                lineHeight: 1.7,
                whiteSpace: "pre-wrap",
                padding: isMobile ? "12px 16px 24px" : "14px 28px 28px",
              }}
            >
              {activeMsg.body}
            </div>
          </motion.div>
        </AnimatePresence>
      ) : (
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: "6px",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--c-text-tertiary)",
            fontSize: "13px",
          }}
        >
          <span className="i-ph:envelope-simple" style={{ width: "36px", height: "36px", opacity: 0.5 }} aria-hidden />
          No message selected
        </div>
      )}
    </div>
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        background: "var(--c-bg)",
        color: "var(--c-text)",
        fontFamily: font,
        borderRadius: "0 0 12px 12px",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Apple Mail-style toolbar */}
      <MacToolbar
        left={
          <>
            <ToolButton glyph="i-ph:pencil-simple" label="Compose new message" onClick={openComposeNew} />
            <div aria-hidden style={{ width: "1px", height: "20px", background: "var(--c-border)", margin: "0 4px" }} />
            <ToolButton
              glyph="i-ph:arrow-bend-up-left"
              label="Reply"
              onClick={() => activeMsg && openComposeReply(activeMsg)}
              disabled={!activeMsg}
            />
            <ToolButton
              glyph="i-ph:arrow-bend-up-right"
              label="Forward"
              onClick={() => activeMsg && openComposeForward(activeMsg)}
              disabled={!activeMsg}
            />
          </>
        }
        right={
          <SearchField value={search} onChange={setSearch} placeholder="Search" label="Search messages" width={isMobile ? 130 : 200} />
        }
      />

      {/* Mobile segmented control */}
      {isMobile && (
        <div
          role="tablist"
          aria-label="Mail panes"
          style={{
            display: "flex",
            gap: "2px",
            margin: "8px 12px 0",
            padding: "2px",
            borderRadius: "9px",
            background: "var(--c-bg-tertiary)",
            flexShrink: 0,
          }}
        >
          {(
            [
              { id: "mailboxes", label: "Mailboxes" },
              { id: "list", label: activeMailbox },
              { id: "reading", label: "Message" },
            ] as { id: MobilePane; label: string }[]
          ).map((pane) => (
            <button
              key={pane.id}
              role="tab"
              aria-selected={mobilePane === pane.id}
              onClick={() => setMobilePane(pane.id)}
              style={{
                flex: 1,
                padding: "6px 0",
                borderRadius: "7px",
                border: "none",
                cursor: "pointer",
                background: mobilePane === pane.id ? "var(--c-bg)" : "transparent",
                boxShadow: mobilePane === pane.id ? "0 1px 4px rgba(0,0,0,0.14)" : "none",
                color: "var(--c-text)",
                fontSize: "12.5px",
                fontWeight: mobilePane === pane.id ? 600 : 400,
                fontFamily: font,
              }}
            >
              {pane.label}
            </button>
          ))}
        </div>
      )}

      <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
        {mailboxPane}
        {listPane}
        {readingPane}
      </div>

      <StatusBar>
        {messages.length === 1 ? "1 message" : `${messages.length} messages`} in {activeMailbox}
      </StatusBar>

      {/* Compose sheet */}
      <AnimatePresence>
        {composing && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={composeTitle}
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            style={{
              position: "absolute",
              bottom: "20px",
              right: "20px",
              width: isMobile ? "calc(100% - 40px)" : "440px",
              maxHeight: "calc(100% - 40px)",
              background: material,
              ...macBlur,
              borderRadius: "10px",
              boxShadow: "0 16px 60px rgba(0,0,0,0.25), 0 4px 16px rgba(0,0,0,0.12)",
              border: hairline,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              zIndex: 10,
            }}
          >
            <div
              style={{
                padding: "10px 14px",
                borderBottom: hairline,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span style={{ fontSize: "13px", fontWeight: 600 }}>{composeTitle}</span>
              <button
                onClick={() => setComposing(false)}
                aria-label="Close compose"
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "18px",
                  color: "var(--c-text-secondary)",
                  lineHeight: 1,
                  padding: "2px 6px",
                }}
              >
                ×
              </button>
            </div>
            <div style={{ padding: "8px 14px", borderBottom: hairline, display: "flex", gap: "8px", alignItems: "center" }}>
              <span style={{ fontSize: "12px", color: "var(--c-text-secondary)", width: "46px", flexShrink: 0 }}>To:</span>
              <input
                value={profile.email}
                readOnly
                aria-readonly="true"
                aria-label="To"
                style={{
                  flex: 1,
                  border: "none",
                  outline: "none",
                  fontSize: "13px",
                  background: "transparent",
                  color: "var(--c-text-secondary)",
                  fontFamily: font,
                }}
              />
            </div>
            <div style={{ padding: "8px 14px", borderBottom: hairline, display: "flex", gap: "8px", alignItems: "center" }}>
              <label htmlFor="mail-subject" style={{ fontSize: "12px", color: "var(--c-text-secondary)", width: "46px", flexShrink: 0 }}>
                Subject:
              </label>
              <input
                id="mail-subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Subject"
                style={{
                  flex: 1,
                  border: "none",
                  outline: "none",
                  fontSize: "13px",
                  background: "transparent",
                  color: "var(--c-text)",
                  fontFamily: font,
                }}
              />
            </div>
            <textarea
              aria-label="Message body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Write your message…"
              style={{
                border: "none",
                outline: "none",
                resize: "none",
                fontSize: "13px",
                lineHeight: 1.6,
                color: "var(--c-text)",
                padding: "12px 14px",
                background: "transparent",
                height: "170px",
                fontFamily: font,
              }}
            />
            {!canSend && (
              <div style={{ padding: "0 14px 4px", fontSize: "11px", color: "var(--c-text-tertiary)" }}>
                Add a subject and a message to enable sending.
              </div>
            )}
            <div style={{ padding: "10px 14px", borderTop: hairline, display: "flex", justifyContent: "flex-end", gap: "8px", flexWrap: "wrap" }}>
              <PushButton onClick={copyEmail} aria-label="Copy email address">
                Copy email
              </PushButton>
              <PushButton onClick={openInGmail} disabled={!canSend} aria-label="Open in Gmail">
                Open in Gmail
              </PushButton>
              <PushButton primary onClick={sendViaMailto} disabled={!canSend} aria-label="Send message">
                Send
              </PushButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Copied toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            role="status"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{
              position: "absolute",
              bottom: "40px",
              left: "50%",
              transform: "translateX(-50%)",
              background: "rgba(28,28,30,0.92)",
              color: "#fff",
              fontSize: "12.5px",
              fontWeight: 600,
              padding: "8px 16px",
              borderRadius: "20px",
              boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
              zIndex: 20,
              maxWidth: "90%",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
