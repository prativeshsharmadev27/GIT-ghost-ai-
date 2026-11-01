import { Bot, LoaderCircle, MessageCircle, Send, Sparkles, UserRound } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { chatWithMentor } from '../services/api'

const starterQuestions = [
  'Isko simple words mein samjhao',
  'What should I do first?',
  'Which files should I look for?',
]

export default function MentorChat({ issue, analysis }) {
  const [language, setLanguage] = useState('english')
  const [messages, setMessages] = useState([])
  const [draft, setDraft] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const transcriptEnd = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    transcriptEnd.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages, loading])

  async function sendMessage(text = draft, retry = false) {
    const content = text.trim()
    if (!content || loading) return

    const nextMessages = retry ? messages : [...messages, { role: 'user', content }]
    const history = nextMessages.slice(-10)
    if (!retry) {
      setMessages(nextMessages)
      setDraft('')
    }
    setError('')
    setLoading(true)
    try {
      const { answer } = await chatWithMentor({
        issue: {
          title: issue?.title || 'Open-source contribution',
          description: issue?.body || '',
          repositoryContext: issue?.repository || '',
          url: issue?.html_url || '',
        },
        analysis: {
          summary: analysis.summary,
          difficulty: analysis.difficulty,
          suggestedApproach: analysis.suggestedApproach,
          roadmap: analysis.roadmap.slice(0, 8).map(({ title, description }) => ({ title, description })),
        },
        messages: history,
        language,
      })
      setMessages((current) => [...current, { role: 'assistant', content: answer }])
    } catch (requestError) {
      setError(requestError.message || 'The mentor could not reply. Please try again.')
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }

  function handleSubmit(event) {
    event.preventDefault()
    sendMessage()
  }

  function handleKeyDown(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      sendMessage()
    }
  }

  const intro = language === 'hinglish'
    ? 'Hi! Issue ko saath mein samajhte hain. Jo bhi confusing ho, poochho—main step-by-step guide karunga.'
    : 'Hi! Let’s work through this issue together. Ask me anything confusing and I’ll guide you one step at a time.'

  return (
    <aside className="mentor-panel" aria-label="AI contribution mentor">
      <div className="mentor-header">
        <div className="mentor-avatar"><Bot size={19} /></div>
        <div className="mentor-heading-copy"><strong>Ask your ghost</strong><span><span className="mentor-online-dot" /> Issue-aware mentor</span></div>
        <select className="mentor-language" aria-label="Mentor reply language" value={language} onChange={(event) => setLanguage(event.target.value)}>
          <option value="english">EN</option>
          <option value="hinglish">HI</option>
        </select>
      </div>
      <div className="mentor-context"><Sparkles size={13} /><span>Chatting about: <strong>{issue?.title || 'your contribution'}</strong></span></div>
      <div className="mentor-transcript" aria-live="polite">
        <div className="mentor-message mentor-message-assistant">
          <span className="message-avatar"><Bot size={13} /></span>
          <p>{intro}</p>
        </div>
        {messages.map((message, index) => (
          <div className={`mentor-message ${message.role === 'user' ? 'mentor-message-user' : 'mentor-message-assistant'}`} key={`${message.role}-${index}`}>
            <span className="message-avatar">{message.role === 'user' ? <UserRound size={13} /> : <Bot size={13} />}</span>
            <p>{message.content}</p>
          </div>
        ))}
        {loading && <div className="mentor-message mentor-message-assistant"><span className="message-avatar"><Bot size={13} /></span><p className="mentor-thinking"><LoaderCircle className="spin" size={14} /> Thinking through your question…</p></div>}
        {error && <div className="mentor-error" role="alert"><span>{error}</span><button onClick={() => sendMessage(messages.at(-1)?.content || draft, true)} disabled={loading}>Retry</button></div>}
        {!messages.length && !loading && <div className="mentor-suggestions"><span>TRY ASKING</span>{starterQuestions.map((question) => <button key={question} onClick={() => sendMessage(question)}>{question}<Send size={11} /></button>)}</div>}
        <div ref={transcriptEnd} />
      </div>
      <form className="mentor-composer" onSubmit={handleSubmit}>
        <textarea
          ref={inputRef}
          aria-label="Ask the AI mentor"
          rows={2}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={language === 'hinglish' ? 'Yahan apna sawaal likho…' : 'Ask a question about this issue…'}
          maxLength={2000}
          disabled={loading}
        />
        <button type="submit" className="mentor-send" aria-label="Send message" disabled={loading || !draft.trim()}><Send size={16} /></button>
      </form>
      <p className="mentor-disclaimer"><MessageCircle size={12} /> AI suggestions can be wrong. You stay in control of your code.</p>
    </aside>
  )
}
