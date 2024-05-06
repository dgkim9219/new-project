
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req) {
	// 요청 헤더에서 로그인 여부를 확인할 수 있도록 쿠키에 접근
  const jwt =  await req.cookies.get("next-auth.session-token");
  // const jwt = await getToken(req
    
 
	// 로그인 상태가 아니면 Redirection
  if (!jwt) {
    return NextResponse.redirect(
      new URL(
        `/api/auth/signin`,
        req.url
      )
    );
  }
else{
  console.log(jwt);
  return NextResponse.next();
} 
}

// 
export const config = {
  matcher: [
    "/calender",
    "/endProduct",
    "/main",
    "/oligo",
    "/pc"
  ]
};