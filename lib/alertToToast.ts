// lib/alertToToast.ts
import toast from '@/lib/toast'

// Replace blocking window.alert by a non-blocking toast (bottom-right)
if (typeof window !== 'undefined') {
  const original = window.alert
  window.alert = (msg?: any) => {
    try {
      const text = typeof msg === 'string' ? msg : JSON.stringify(msg)
      toast(text || 'OK')
    } catch {
      original(msg)
    }
  }
}