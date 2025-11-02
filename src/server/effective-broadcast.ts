// src/server/effective-broadcast.ts
import { checkAndSyncUser } from '@/server/broadcastSync'

export async function ensureUserUpToDate(userId: string) {
  try {
    await checkAndSyncUser(userId)
  } catch (e) {
    console.error('Broadcast sync error:', e)
  }
}
