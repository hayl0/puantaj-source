import NextAuth from "next-auth";
import { authOptions } from "./authOptions";

const handler = NextAuth(authOptions);

export const dynamic = 'force-dynamic';
export { handler as GET, handler as POST };
