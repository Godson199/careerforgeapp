import { useEffect, useRef, useState } from 'react';
import { API_BASE } from '../config.js';

function getSessionId() {
  const key = 'cf_chat_session_id';
  let sessionId = sessionStorage.getItem(key);
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    sessionStorage.setItem(key, sessionId);
  }
  return sessionId;
}

const suggestions = [
  { label: 'Tracks?', message: 'What tracks do you offer?' },
  { label: 'Training?', message: 'How does training work?' },
  { label: 'How to apply?', message: 'How do I apply?' },
  { label: 'Partnerships?', message: 'How do partnerships work?' },
];

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { sender: 'assistant', text: "Hi, I'm the CareerForge assistant. Ask me about programmes, tracks or how to apply." },
  ]);
  const [sending, setSending] = useState(false);
  const [sessionId] = useState(getSessionId);
  const logRef = useRef(null);

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [messages, sending]);

  async function sendMessage(message) {
    const trimmed = message.trim();
    if (!trimmed || sending) return;

    setMessages((current) => [...current, { sender: 'user', text: trimmed }]);
    setInput('');
    setSending(true);

    try {
      const response = await fetch(`${API_BASE}/api/bot/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId, message: trimmed }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || 'The assistant request failed.');
      setMessages((current) => [...current, { sender: 'assistant', text: data.reply }]);
    } catch (error) {
      setMessages((current) => [
        ...current,
        { sender: 'assistant', text: error.message || 'The assistant could not be reached. Please try again.' },
      ]);
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      <button
        className="cf-chat-toggle"
        type="button"
        aria-label={open ? 'Close CareerForge assistant' : 'Open CareerForge assistant'}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <i className={`fa ${open ? 'fa-times' : 'fa-comments'}`} aria-hidden="true" />
      </button>
      {open && (
        <section className="cf-chat-panel" role="dialog" aria-label="CareerForge assistant">
          <header className="cf-chat-header">
            <span>CareerForge Assistant</span>
            <button type="button" aria-label="Close assistant" onClick={() => setOpen(false)}>×</button>
          </header>
          <div className="cf-chat-messages" ref={logRef} aria-live="polite">
            {messages.map((message, index) => (
              <div className={`cf-chat-message cf-chat-${message.sender}`} key={`${index}-${message.text}`}>
                {message.text}
              </div>
            ))}
            {sending && <div className="cf-chat-message cf-chat-assistant">Typing…</div>}
          </div>
          <div className="cf-chat-suggestions">
            {suggestions.map((suggestion) => (
              <button
                type="button"
                key={suggestion.label}
                disabled={sending}
                onClick={() => sendMessage(suggestion.message)}
              >
                {suggestion.label}
              </button>
            ))}
          </div>
          <form
            className="cf-chat-form"
            onSubmit={(event) => {
              event.preventDefault();
              sendMessage(input);
            }}
          >
            <input
              aria-label="Message"
              placeholder="Ask about programmes..."
              value={input}
              disabled={sending}
              onChange={(event) => setInput(event.target.value)}
            />
            <button type="submit" disabled={sending}>{sending ? '…' : 'Send'}</button>
          </form>
        </section>
      )}
    </>
  );
}
