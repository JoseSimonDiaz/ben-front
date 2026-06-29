import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { sendChatMessage } from '../api/index.js'
import { ROUTES, careerDetail } from '../constants/routes.js'

const initialMessages = [
  { role: 'assistant', text: 'Hola. Soy Ben, tu asistente vocacional. Puedo ayudarte a explorar carreras, mostrarte estadísticas y experiencias de egresados. ¿Por dónde querés empezar?' },
]

function MessageList({ messages, index }) {
  if (!messages || index >= messages.length) return null
  const msg = messages[index]
  return (
    <>
      <div key={index}>
        <div className={`flex flex-col gap-2 max-w-[85%] ${msg.role === 'user' ? 'self-end' : 'self-start'} group`}>
          {msg.role === 'assistant' && (
            <div className="flex items-center gap-2 px-1">
              <span className="text-[10px] font-bold text-primary uppercase">Ben AI</span>
              <span className="text-[10px] text-outline">14:02</span>
            </div>
          )}
          {msg.role === 'user' && (
            <div className="flex items-center justify-end gap-2 px-1">
              <span className="text-[10px] text-outline">14:03</span>
              <span className="text-[10px] font-bold text-secondary uppercase">Tú</span>
            </div>
          )}
          <div className={`p-4 leading-relaxed ${
            msg.role === 'user'
              ? 'bg-primary-container text-on-primary-container rounded-tl-xl rounded-bl-xl rounded-br-xl shadow-md font-medium'
              : 'bg-surface-container text-on-surface rounded-tr-xl rounded-bl-xl rounded-br-xl border border-outline-variant/30 shadow-sm'
          }`}>
            {msg.text}
          </div>
        </div>

        {msg.card && (
          <div className="max-w-[90%] self-start mt-4 bg-surface-container-high border-t-2 border-primary rounded-xl overflow-hidden shadow-xl hover:scale-[1.02] transition-transform duration-300">
            <div className="h-32 w-full bg-surface-container-highest flex items-center justify-center">
              <span className="material-symbols-outlined text-5xl text-primary">code</span>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-headline-lg-mobile text-lg font-bold">Ingeniería de Software</h3>
                  <p className="text-xs text-on-surface-variant">Especialidad: Desarrollo Sostenible</p>
                </div>
                <span className="bg-primary/20 backdrop-blur-md px-2 py-1 rounded-md border border-primary/30 text-[10px] font-bold text-primary">
                  98% Match
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-0.5 rounded-full bg-surface-variant text-[10px] font-medium text-secondary">Sistemas</span>
                <span className="px-2 py-0.5 rounded-full bg-surface-variant text-[10px] font-medium text-secondary">Green Tech</span>
                <span className="px-2 py-0.5 rounded-full bg-surface-variant text-[10px] font-medium text-secondary">Ética IA</span>
              </div>
              <Link to={careerDetail('1')}>
                <button className="w-full py-2 bg-primary text-on-primary rounded-lg font-bold text-sm hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">explore</span>
                  Ver detalles de carrera
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
      <MessageList messages={messages} index={index + 1} />
    </>
  )
}

export default function Chat() {
  const [messages, setMessages] = useState(initialMessages)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)
  const textareaRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function autoResize() {
    const el = textareaRef.current
    if (el) {
      el.style.height = 'auto'
      el.style.height = el.scrollHeight + 'px'
    }
  }

function buildHistory(messages, index = 0, result = []) {
  if (!messages || index >= messages.length) return result
  result.push({ role: messages[index].role, content: messages[index].text })
  return buildHistory(messages, index + 1, result)
}

  async function handleSend(text) {
    const msg = text || input
    if (!msg.trim() || loading) return

    const userMsg = { role: 'user', text: msg }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setLoading(true)
    if (textareaRef.current) textareaRef.current.style.height = 'auto'

    try {
      const history = buildHistory(messages)
      const data = await sendChatMessage(msg, history)
      setMessages((prev) => [...prev, { role: 'assistant', text: data.reply }])
    } catch {
      setMessages((prev) => [...prev, { role: 'assistant', text: 'Disculpá, hubo un error al procesar tu mensaje. ¿Podrías intentar de nuevo?' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-screen">
      <main className="flex-grow pt-16 pb-32 overflow-y-auto chat-scroll flex flex-col items-center">
        <div className="w-full max-w-3xl px-margin-mobile py-lg flex flex-col gap-6">
          <div className="flex justify-center">
            <span className="px-4 py-1 rounded-full bg-surface-container-highest/30 border border-outline-variant/20 text-[11px] font-label-md text-on-surface-variant uppercase tracking-widest">
              Hoy
            </span>
          </div>

          <MessageList messages={messages} index={0} />

          {loading && (
            <div className="flex items-center gap-2 self-start px-1 animate-pulse">
              <span className="text-[10px] font-label-md text-on-surface-variant">Ben está analizando más opciones...</span>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </main>

      <div className="fixed bottom-16 md:bottom-0 left-0 w-full z-40 p-margin-mobile bg-gradient-to-t from-surface via-surface/95 to-transparent">
        <div className="max-w-3xl mx-auto flex items-end gap-2 glass-panel p-2 rounded-2xl shadow-2xl">
          <button className="p-3 text-on-surface-variant hover:text-primary transition-colors">
            <span className="material-symbols-outlined">add_circle</span>
          </button>
          <div className="flex-grow relative">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => { setInput(e.target.value); autoResize() }}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
              placeholder="Hazle una pregunta a Ben..."
              rows={1}
              className="w-full bg-surface-container-lowest text-on-surface border border-outline-variant/30 rounded-xl px-4 py-3 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 placeholder:text-on-surface-variant/50 resize-none max-h-32 text-sm"
            />
          </div>
          <button
            onClick={() => handleSend()}
            disabled={loading || !input.trim()}
            className="bg-primary text-on-primary p-3 rounded-xl shadow-lg hover:bg-primary-container transition-all active:scale-90 flex items-center justify-center disabled:opacity-50"
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>send</span>
          </button>
        </div>
      </div>
    </div>
  )
}
