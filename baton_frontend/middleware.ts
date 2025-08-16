import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const protectedRoutes = ["/user-info"];

export default async function middleware(request: NextRequest) {
    const {pathname} = request.nextUrl;
    
    const isProtected = protectedRoutes.some((route) => 
        pathname.startsWith(route));

    if (!isProtected) {
        return NextResponse.next();
    }

    const token = await getToken({ req: request, secret: process.env.AUTH_SECRET });
    if (!token) {
        const url = new URL("/api/auth/signin", request.url);
        url.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(url);
    }
    return NextResponse.next();
}

export const config = { matcher: ["/user-info/:path*"] };