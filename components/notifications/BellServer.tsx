// components/notifications/BellServer.tsx
import { inboxUnreadCount } from '@/app/admin/studio/actions'
import Bell from './Bell'

export default async function BellServer() {
  const res = await inboxUnreadCount()
  const count = res.ok ? res.count : 0
  return <Bell initialCount={count} />
}
