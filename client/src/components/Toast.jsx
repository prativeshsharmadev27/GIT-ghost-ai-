import { Check, AlertCircle } from 'lucide-react'
import { useEffect } from 'react'

export default function Toast({ message, type = 'success', onDismiss }) {
  useEffect(() => {
    if (!message) return undefined
    const timer = window.setTimeout(onDismiss, 2000)
    return () => window.clearTimeout(timer)
  }, [message, onDismiss])

  if (!message) return null
  const Icon = type === 'error' ? AlertCircle : Check
  return <div className={`toast toast-${type}`} role="status"><Icon size={17} />{message}</div>
}
