import { motion } from "framer-motion";
import { useContext, useState } from "react";
import UserContext from "../../context/UserContext";

const examples = [
  { id: "demo-1", name: "Alex Morgan", initials: "AM", preview: "That sounds great! See you Saturday.", messages: [
    { id: 1, mine: false, text: "Hey! Are we still meeting this weekend?", time: "10:24 AM" },
    { id: 2, mine: true, text: "Absolutely. Saturday afternoon works for me.", time: "10:28 AM" },
    { id: 3, mine: false, text: "That sounds great! See you Saturday.", time: "10:31 AM" }
  ] },
  { id: "demo-2", name: "Jamie Rivera", initials: "JR", preview: "I'll send you the details later.", messages: [
    { id: 1, mine: false, text: "I have a few ideas for the project.", time: "Yesterday" },
    { id: 2, mine: true, text: "I'd love to hear them!", time: "Yesterday" },
    { id: 3, mine: false, text: "I'll send you the details later.", time: "Yesterday" }
  ] }
];

const Messages = ({ setOption }) => {
  const { preferences, friends = [] } = useContext(UserContext);
  const [selected, setSelected] = useState(examples[0].id);
  const [draft, setDraft] = useState("");
  const [showConversation, setShowConversation] = useState(false);
  const conversations = examples;
  const current = conversations.find((conversation) => conversation.id === selected);
  const dark = preferences.darkMode;
  const surface = dark ? "bg-[#1b1b1b] border-amber-200/15 text-white" : "bg-white border-amber-200/60 text-slate-900";
  return <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 24 }} className={`fixed inset-0 z-[999] flex flex-col ${surface}`}>
    <header className="shrink-0 flex justify-between items-center gap-3 p-4 border-b border-amber-400/20">
      <div><p className="text-xs text-amber-500 font-semibold uppercase tracking-wider">Social</p><h2 className="text-xl font-semibold">Messages</h2></div>
      <button type="button" onClick={() => setOption(null)} className="rounded-xl border border-amber-400/30 px-4 py-2 text-sm">Close</button>
    </header>
    <div className="flex-1 min-h-0 grid md:grid-cols-[320px_minmax(0,1fr)]">
      <aside className={`${showConversation ? "hidden md:block" : "block"} overflow-y-auto border-r border-amber-400/20 p-3`}>
        <p className="text-xs opacity-60 px-2 mb-3">Conversation preview · Mock data</p>
        {conversations.map((conversation) => <button key={conversation.id} type="button" onClick={() => { setSelected(conversation.id); setShowConversation(true); setDraft(""); }}
          className={`w-full flex items-center gap-3 p-3 rounded-xl text-left mb-2 ${selected === conversation.id ? "bg-amber-400/15 border border-amber-400/30" : "hover:bg-amber-400/10 border border-transparent"}`}>
          <span className="w-11 h-11 rounded-full bg-amber-500/20 text-amber-600 grid place-items-center text-sm font-semibold shrink-0">{conversation.initials}</span>
          <span className="min-w-0"><span className="block font-semibold text-sm">{conversation.name}</span><span className="block text-xs opacity-60 truncate">{conversation.preview}</span></span>
        </button>)}
        <div className="rounded-xl border border-amber-400/20 p-3 mt-5"><p className="text-sm font-semibold">Your connections</p><p className="text-xs opacity-60 mt-1">{friends.length} connected friend{friends.length === 1 ? "" : "s"}. Real conversations will appear here after messaging is connected.</p></div>
      </aside>
      <section className={`${showConversation ? "flex" : "hidden md:flex"} min-h-0 flex-col`}>
        <div className="p-4 border-b border-amber-400/20 flex items-center gap-3">
          <button type="button" onClick={() => setShowConversation(false)} className="md:hidden text-sm text-amber-500">← Back</button>
          <div><h3 className="font-semibold">{current.name}</h3><p className="text-xs opacity-60">Demo conversation · Not a real friend</p></div>
        </div>
        <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4">
          {current.messages.map((message) => <div key={message.id} className={`flex ${message.mine ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${message.mine ? "bg-amber-500 text-slate-950" : dark ? "bg-white/10" : "bg-slate-100"}`}>
              <p className="text-sm">{message.text}</p><p className="text-[10px] opacity-60 mt-2">{message.time}</p>
            </div>
          </div>)}
        </div>
        <form onSubmit={(event) => { event.preventDefault(); }} className="p-3 border-t border-amber-400/20 flex gap-2">
          <input aria-label="Message draft" value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Message composer preview…" className="flex-1 min-w-0 bg-transparent border border-amber-400/30 rounded-xl px-3 py-2 text-sm" />
          <button type="submit" disabled className="bg-amber-500 text-slate-950 rounded-xl px-4 py-2 text-sm font-semibold opacity-50 cursor-not-allowed">Send</button>
        </form>
        <p className="text-xs opacity-60 px-4 pb-3">Messaging is a UI preview. No messages are sent or saved.</p>
      </section>
    </div>
  </motion.div>;
};
export default Messages;
