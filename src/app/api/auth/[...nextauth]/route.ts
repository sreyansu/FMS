import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth';

// Workaround for NextAuth.js v4 with App Router
const handler = NextAuth as (options: typeof authOptions) => {
  GET: (req: Request) => Promise<Response>;
  POST: (req: Request) => Promise<Response>;
};

const auth = handler(authOptions);

export const GET = auth.GET;
export const POST = auth.POST;
