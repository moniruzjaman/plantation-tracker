import { useRef, useState } from 'react';
import { Bot, Check, FileText, ImagePlus, Loader2, Paperclip, Send, Sparkles, Trash2, X } from 'lucide-react';

type GeminiPart = { text?: string; inlineData?: { mimeType: string; data: string } };
type GeminiMessage = { role: 'user' | 'model'; parts: GeminiPart[] };
type AttachedFile = { file: File; data: string };

type ChatMessage = {
  role: 'user' | 'assistant';
  text?: string;
  attachment?: { name: string; type: string; preview?: string };
};

const SUGGESTIONS = ['বৃক্ষরোপণের নিয়মাবলি', 'ফর্ম কিভাবে পূরণ করবো?', 'অফলাইনে ডেটা সেভ'];
const MODELS = ['gemini-2.5-flash-preview-05-20', 'gemini-2.0-flash'];
const WELCOME = 'আসসালামু আলাইকুম! 🌿 আমি আপনার বৃক্ষরোপণ ট্র্যাকার অ্যাপের AI সহকারী। ছবি, PDF বা টেক্সট প্রশ্ন পাঠান — আমি সাহায্য করবো।';
const SYSTEM_CONTEXT = 'তুমি "০৫ বছরে ২৫ কোটি বৃক্ষরোপণ" কর্মসূচির বৃক্ষরোপণ ট্র্যাকার অ্যাপের AI সহকারী। বাংলায় সংক্ষেপে, সহায়কভাবে উত্তর দাও।';

function readAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(',')[1] || '');
    reader.onerror = () => reject(reader.error ?? new Error('ফাইল পড়া যায়নি'));
    reader.readAsDataURL(file);
  });
}

export default function Copilot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([{ role: 'assistant', text: WELCOME }]);
  const [history, setHistory] = useState<GeminiMessage[]>([]);
  const [attached, setAttached] = useState<AttachedFile | null>(null);
  const [loading, setLoading] = useState(false);
  const [modelLabel, setModelLabel] = useState('GEMINI 3.5');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetChat = () => {
    setHistory([]);
    setMessages([{ role: 'assistant', text: WELCOME }]);
    setAttached(null);
    setInput('');
  };

  const handleFile = async (file?: File) => {
    if (!file || (!file.type.startsWith('image/') && file.type !== 'application/pdf')) return;
    try {
      setAttached({ file, data: await readAsBase64(file) });
    } catch {
      setMessages((current) => [...current, { role: 'assistant', text: '❌ ফাইলটি পড়া যায়নি। আবার চেষ্টা করুন।' }]);
    }
  };

  const sendMessage = async (suggestion?: string) => {
    const text = (suggestion ?? input).trim();
    if ((!text && !attached) || loading) return;

    const file = attached;
    const userMessage: ChatMessage = {
      role: 'user',
      text,
      attachment: file ? { name: file.file.name, type: file.file.type, preview: file.file.type.startsWith('image/') ? `data:${file.file.type};base64,${file.data}` : undefined } : undefined,
    };
    const userParts: GeminiPart[] = [];
    if (text) userParts.push({ text });
    if (file) userParts.push({ inlineData: { mimeType: file.file.type, data: file.data } });

    const nextHistory = [...history, { role: 'user' as const, parts: userParts }];
    setMessages((current) => [...current, userMessage]);
    setHistory(nextHistory);
    setInput('');
    setAttached(null);
    setLoading(true);

    const apiKey = window.__GEMINI_API_KEY__;
    if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
      setMessages((current) => [...current, { role: 'assistant', text: '⚠️ Gemini API Key সেটআপ করা হয়নি। Vercel-এ `GEMINI_API_KEY` Environment Variable যোগ করুন।' }]);
      setLoading(false);
      return;
    }

    const contents: GeminiMessage[] = [
      { role: 'user', parts: [{ text: SYSTEM_CONTEXT }] },
      { role: 'model', parts: [{ text: 'ঠিক আছে, আমি বৃক্ষরোপণ সম্পর্কে সাহায্য করবো।' }] },
      ...nextHistory,
    ];

    let lastError = 'সংযোগ ত্রুটি';
    for (let index = 0; index < MODELS.length; index += 1) {
      const model = MODELS[index];
      setModelLabel(model.includes('2.5') ? 'GEMINI 3.5' : 'GEMINI 2.0');
      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents, generationConfig: { maxOutputTokens: 1024, temperature: 0.7 } }),
        });
        if (response.status === 429 && index < MODELS.length - 1) continue;
        const payload = await response.json().catch(() => ({}));
        if (!response.ok) {
          lastError = payload?.error?.message || `HTTP ${response.status}`;
          break;
        }
        const reply = payload?.candidates?.[0]?.content?.parts?.[0]?.text || 'দুঃখিত, উত্তর পাওয়া যায়নি।';
        setHistory((current) => [...current, { role: 'model', parts: [{ text: reply }] }]);
        setMessages((current) => [...current, { role: 'assistant', text: reply }]);
        setLoading(false);
        return;
      } catch (error) {
        lastError = error instanceof Error ? error.message : lastError;
        if (index === MODELS.length - 1) break;
      }
    }
    setMessages((current) => [...current, { role: 'assistant', text: `❌ ${lastError}. কিছুক্ষণ পর আবার চেষ্টা করুন।` }]);
    setLoading(false);
  };

  return (
    <div className="fixed bottom-24 right-4 sm:right-6 z-[60] font-sans">
      {open && (
        <section className="absolute bottom-[74px] right-0 w-[calc(100vw-2rem)] sm:w-[380px] h-[min(560px,72vh)] max-h-[72vh] rounded-2xl overflow-hidden bg-gray-50 shadow-2xl flex flex-col border border-gray-200" aria-label="AI Copilot">
          <header className="bg-gradient-to-r from-slate-800 to-slate-700 p-3.5 flex items-center gap-2.5 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-600 to-emerald-500 flex items-center justify-center text-white"><Sparkles size={20} /></div>
            <div className="flex-1 min-w-0">
              <div className="text-white text-sm font-semibold">কৃত্রিম মেধা সহ-সহযোগ</div>
              <div className="flex items-center gap-1.5 mt-0.5"><span className="bg-green-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{modelLabel}</span><span className="text-slate-300 text-[11px]">AI Assistant</span></div>
            </div>
            <button type="button" onClick={resetChat} className="text-slate-300 hover:text-white p-1" title="মুছুন" aria-label="চ্যাট মুছুন"><Trash2 size={17} /></button>
            <button type="button" onClick={() => setOpen(false)} className="text-slate-300 hover:text-white p-1" title="বন্ধ করুন" aria-label="সহযোগী বন্ধ করুন"><X size={19} /></button>
          </header>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((message, index) => (
              <div key={`${message.role}-${index}`} className={message.role === 'user' ? 'flex justify-end' : 'flex gap-2 items-start'}>
                {message.role === 'assistant' && <div className="w-7 h-7 rounded-full bg-gradient-to-br from-green-600 to-emerald-500 text-white flex items-center justify-center shrink-0"><Sparkles size={14} /></div>}
                <div className={message.role === 'user' ? 'max-w-[85%] rounded-2xl rounded-tr-sm bg-gradient-to-br from-green-600 to-emerald-500 text-white px-3.5 py-2.5 text-[13px] leading-relaxed' : 'max-w-[85%] rounded-2xl rounded-tl-sm bg-white text-gray-800 px-3.5 py-2.5 text-[13px] leading-relaxed shadow-sm whitespace-pre-wrap'}>
                  {message.attachment?.preview && <img src={message.attachment.preview} alt={message.attachment.name} className="max-w-full rounded-lg mb-1.5" />}
                  {message.attachment && !message.attachment.preview && <div className="flex items-center gap-1.5 mb-1 text-xs"><FileText size={14} />{message.attachment.name}</div>}
                  {message.text}
                </div>
              </div>
            ))}
            {loading && <div className="flex gap-2 items-center text-gray-400 text-xs"><div className="w-7 h-7 rounded-full bg-green-600 text-white flex items-center justify-center"><Sparkles size={14} /></div><Loader2 size={16} className="animate-spin" /> উত্তর প্রস্তুত হচ্ছে…</div>}
          </div>

          {messages.length === 1 && <div className="px-4 pb-2.5 flex flex-wrap gap-1.5">{SUGGESTIONS.map((suggestion) => <button type="button" key={suggestion} onClick={() => sendMessage(suggestion)} className="bg-white border border-gray-300 rounded-full px-3 py-1.5 text-xs text-gray-700 hover:border-green-400 hover:bg-green-50">{suggestion}</button>)}</div>}
          {attached && <div className="px-4 pb-2"><div className="bg-white border border-gray-200 rounded-xl p-2 flex items-center gap-2 text-xs"><div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center overflow-hidden">{attached.file.type.startsWith('image/') ? <img src={`data:${attached.file.type};base64,${attached.data}`} alt="সংযুক্তি" className="w-full h-full object-cover" /> : <FileText size={20} className="text-green-700" />}</div><span className="truncate flex-1">{attached.file.name}</span><button type="button" onClick={() => setAttached(null)} className="text-red-500 p-1" aria-label="সংযুক্তি সরান"><X size={15} /></button></div></div>}
          <div className="p-2.5 px-4 bg-white border-t border-gray-200 flex items-center gap-2 shrink-0">
            <button type="button" onClick={() => fileInputRef.current?.click()} className="text-gray-500 hover:text-green-700 p-1" title="ছবি বা PDF যোগ করুন" aria-label="ছবি বা PDF যোগ করুন"><Paperclip size={21} /></button>
            <input ref={fileInputRef} type="file" accept="image/*,.pdf" className="hidden" onChange={(event) => { void handleFile(event.target.files?.[0]); event.target.value = ''; }} />
            <input value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); void sendMessage(); } }} placeholder="প্রশ্নটি লিখুন..." className="flex-1 min-w-0 border border-gray-200 rounded-xl px-3.5 py-2.5 text-[13px] outline-none focus:border-green-400 bg-gray-50" />
            <button type="button" onClick={() => void sendMessage()} disabled={loading || (!input.trim() && !attached)} className="w-10 h-10 rounded-full bg-gradient-to-br from-green-600 to-emerald-500 text-white flex items-center justify-center shadow-md disabled:opacity-50" aria-label="প্রশ্ন পাঠান"><Send size={17} /></button>
          </div>
        </section>
      )}
      {!open && <button type="button" onClick={() => setOpen(true)} className="w-14 h-14 rounded-full bg-gradient-to-br from-green-600 to-emerald-500 text-white flex items-center justify-center shadow-lg hover:scale-105 transition-transform" title="AI সহকারী খুলুন" aria-label="AI সহকারী খুলুন"><Bot size={27} /></button>}
    </div>
  );
}
