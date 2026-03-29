import { Ratelimit, type Duration } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { NextResponse } from "next/server";

type RateLimitPolicyName =
  | "authLogin"
  | "authRegister"
  | "authForgotPassword"
  | "authResetPassword"
  | "authResendVerification";

type RateLimitPolicy = {
  limit: number;
  window: Duration;
  prefix: string;
};

type RateLimitResult = {
  success: boolean;
  remaining: number;
  reset: number;
  limit: number;
};

const RATE_LIMIT_POLICIES: Record<RateLimitPolicyName, RateLimitPolicy> = {
  authLogin: {
    limit: 5,
    window: "15 m",
    prefix: "auth:login",
  },
  authRegister: {
    limit: 3,
    window: "1 h",
    prefix: "auth:register",
  },
  authForgotPassword: {
    limit: 3,
    window: "1 h",
    prefix: "auth:forgot-password",
  },
  authResetPassword: {
    limit: 5,
    window: "15 m",
    prefix: "auth:reset-password",
  },
  authResendVerification: {
    limit: 3,
    window: "15 m",
    prefix: "auth:resend-verification",
  },
};

let redisClient: Redis | null | undefined;
const ratelimiters = new Map<RateLimitPolicyName, Ratelimit>();

function getRedisClient() {
  if (redisClient !== undefined) {
    return redisClient;
  }

  if (
    !process.env.UPSTASH_REDIS_REST_URL ||
    !process.env.UPSTASH_REDIS_REST_TOKEN
  ) {
    redisClient = null;
    return redisClient;
  }

  try {
    redisClient = Redis.fromEnv();
  } catch (error) {
    console.error("[Rate Limit] Failed to initialize Upstash Redis client.", error);
    redisClient = null;
  }

  return redisClient;
}

function getRatelimiter(policyName: RateLimitPolicyName) {
  const existing = ratelimiters.get(policyName);

  if (existing) {
    return existing;
  }

  const redis = getRedisClient();

  if (!redis) {
    return null;
  }

  const policy = RATE_LIMIT_POLICIES[policyName];
  const ratelimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(policy.limit, policy.window),
    analytics: true,
    prefix: policy.prefix,
  });

  ratelimiters.set(policyName, ratelimiter);

  return ratelimiter;
}

function getFailOpenResult(policyName: RateLimitPolicyName): RateLimitResult {
  const policy = RATE_LIMIT_POLICIES[policyName];

  return {
    success: true,
    remaining: policy.limit,
    reset: Date.now(),
    limit: policy.limit,
  };
}

export function getRequestIp(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");

  if (forwardedFor) {
    const [firstIp] = forwardedFor.split(",");

    if (firstIp?.trim()) {
      return firstIp.trim();
    }
  }

  const realIp = request.headers.get("x-real-ip");

  if (realIp?.trim()) {
    return realIp.trim();
  }

  return null;
}

function normalizeIdentifier(identifier: string) {
  return identifier.trim().toLowerCase();
}

export async function checkRateLimit({
  policy,
  request,
  identifier,
}: {
  policy: RateLimitPolicyName;
  request: Request;
  identifier?: string | null;
}): Promise<RateLimitResult> {
  const ratelimiter = getRatelimiter(policy);

  if (!ratelimiter) {
    return getFailOpenResult(policy);
  }

  const ip = getRequestIp(request);

  if (!ip) {
    return getFailOpenResult(policy);
  }

  const identifierPart = identifier?.trim()
    ? `:${normalizeIdentifier(identifier)}`
    : "";
  const key = `${ip}${identifierPart}`;

  try {
    const result = await ratelimiter.limit(key);

    void result.pending.catch(() => {
      return undefined;
    });

    return {
      success: result.success,
      remaining: result.remaining,
      reset: result.reset,
      limit: result.limit,
    };
  } catch (error) {
    console.error(`[Rate Limit] Failed for ${policy}. Allowing request.`, error);
    return getFailOpenResult(policy);
  }
}

export function getRetryAfterSeconds(reset: number) {
  return Math.max(1, Math.ceil((reset - Date.now()) / 1000));
}

export function getRateLimitMessage(reset: number) {
  const retryAfterSeconds = getRetryAfterSeconds(reset);
  const retryAfterMinutes = Math.max(1, Math.ceil(retryAfterSeconds / 60));

  return `Too many attempts. Please try again in ${retryAfterMinutes} minute${retryAfterMinutes === 1 ? "" : "s"}.`;
}

export function createRateLimitHeaders(
  result: Pick<RateLimitResult, "limit" | "remaining" | "reset">,
) {
  return {
    "Retry-After": String(getRetryAfterSeconds(result.reset)),
    "X-RateLimit-Limit": String(result.limit),
    "X-RateLimit-Remaining": String(Math.max(0, result.remaining)),
    "X-RateLimit-Reset": String(result.reset),
  };
}

export function createRateLimitResponse(
  result: Pick<RateLimitResult, "limit" | "remaining" | "reset">,
  options?: {
    url?: string;
  },
) {
  return NextResponse.json(
    {
      error: getRateLimitMessage(result.reset),
      ...(options?.url ? { url: options.url } : {}),
    },
    {
      status: 429,
      headers: createRateLimitHeaders(result),
    },
  );
}
