import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function proxy(request) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      const signInUrl = new URL("/sign-in", request.url);
      signInUrl.searchParams.set("protected", "1");
      return NextResponse.redirect(signInUrl);
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Could not verify session for a protected route:", error);
    return NextResponse.json(
      { error: "Unable to verify your session. Please try again." },
      { status: 503 },
    );
  }
}

export const config = {
  matcher: ["/add-book/:path*", "/my-books/:path*", "/my-borrows/:path*"],
};
