import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  // Example: block /admin if not admin. Replace with a real check in your app.
  // Here we just pass through; keep this file as a placeholder.
  return NextResponse.next();
}

// export const config = { matcher: ['/admin/:path*'] };
