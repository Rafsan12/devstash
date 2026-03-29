import { handlers } from "@/auth";
import { checkRateLimit, createRateLimitResponse } from "@/lib/rate-limit";
import { type NextRequest } from "next/server";

async function handleCredentialsCallback(request: NextRequest) {
  const formData = await request.clone().formData();
  const emailValue = formData.get("email");
  const email = typeof emailValue === "string" ? emailValue.trim().toLowerCase() : "";
  const callbackUrlValue = formData.get("callbackUrl");
  const callbackUrl =
    typeof callbackUrlValue === "string" && callbackUrlValue
      ? callbackUrlValue
      : "/dashboard";
  const signInUrl = new URL("/sign-in", request.url);

  signInUrl.searchParams.set("error", "CredentialsSignin");
  signInUrl.searchParams.set("code", "rate_limited");
  signInUrl.searchParams.set("callbackUrl", callbackUrl);

  if (email) {
    signInUrl.searchParams.set("email", email);
  }

  const rateLimit = await checkRateLimit({
    policy: "authLogin",
    request,
    identifier: email,
  });

  if (!rateLimit.success) {
    return createRateLimitResponse(rateLimit, {
      url: signInUrl.toString(),
    });
  }

  return handlers.POST(request);
}

export const GET = handlers.GET;

export async function POST(request: NextRequest) {
  if (request.url.includes("/callback/credentials")) {
    return handleCredentialsCallback(request);
  }

  return handlers.POST(request);
}
