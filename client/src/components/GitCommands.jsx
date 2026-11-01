import { Check, Copy, Terminal } from 'lucide-react'
import { useState } from 'react'

export default function GitCommands({ commands, onToast }) {
  const [copied, setCopied] = useState(null)

  async function copyCommand(command, index) {
    try {
      await navigator.clipboard.writeText(command)
      setCopied(index)
      onToast('Copied!')
      window.setTimeout(() => setCopied(null), 2000)
    } catch {
      onToast('Clipboard access was blocked by your browser.', 'error')
    }
  }

  return (
    <section className="panel commands-panel">
      <div className="section-heading"><span className="heading-icon green"><Terminal size={17} /></span><div><h3>Your Git toolkit</h3><p>Useful commands to set up a safe place to work.</p></div></div>
      <div className="commands-list">{commands.map((item, index) => <article className="command-card" key={`${item.label}-${index}`}><div className="command-top"><strong>{item.label}</strong><button className={`copy-button ${copied === index ? 'copy-success' : ''}`} onClick={() => copyCommand(item.command, index)} aria-label={`Copy ${item.label}`}>{copied === index ? <Check size={15} /> : <Copy size={15} />}<span>{copied === index ? 'Copied' : 'Copy'}</span></button></div><code className="command-code">{item.command}</code><p>{item.explanation}</p></article>)}</div>
    </section>
  )
}
