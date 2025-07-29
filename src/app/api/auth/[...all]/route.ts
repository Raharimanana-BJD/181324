import { auth } from "@/lib/auth"; // path to your auth file
import { toNextJsHandler } from "better-auth/next-js";
import arcjet, { detectBot, shield, tokenBucket } from "@arcjet/next";
import { NextRequest, NextResponse } from "next/server";

const aj = arcjet({
  key: process.env.ARCJET_KEY!, // Get your site key from https://app.arcjet.com
  characteristics: ["ip.src"], // Track requests by IP
  rules: [
    // Shield protects your app from common attacks e.g. SQL injection
    shield({ mode: "LIVE" }),
    // Create a bot detection rule
    detectBot({
      mode: "LIVE", // Blocks requests. Use "DRY_RUN" to log only
      // Block all bots except the following
      allow: [
        "CATEGORY:SEARCH_ENGINE", // Google, Bing, etc
        // Uncomment to allow these other common bot categories
        // See the full list at https://arcjet.com/bot-list
        //"CATEGORY:MONITOR", // Uptime monitoring services
        //"CATEGORY:PREVIEW", // Link previews e.g. Slack, Discord
      ],
    }),
    // Create a token bucket rate limit. Other algorithms are supported.
    tokenBucket({
      mode: "LIVE",
      refillRate: 5, // Refill 5 tokens per interval
      interval: 10, // Refill every 10 seconds
      capacity: 10, // Bucket capacity of 10 tokens
    }),
  ],
});

const betterAuthHeaders = toNextJsHandler(auth.handler);

const ajProtectePost = async (req: NextRequest) => {
  const { email } = await req.clone().json();
  const decision = await aj.protect(req, { email });
  if (decision.isDenied()) {
    if (decision.reason.isEmail()) {
      let message = "";
      if (decision.reason.emailTypes.includes("INVALID")) {
        message = "email adresse format is invalid. Is there a typo?";
      } else if (decision.reason.emailTypes.includes("DISPOSABLE")) {
        message = "We do not allow disponsable email adresse.";
      } else if (decision.reason.emailTypes.includes("NO_MX_RECORDS")) {
        message =
          "Your email domain does not have an MX record. Is there a typo?";
      } else {
        message = "Invalid email";
      }
      return NextResponse.json(
        {
          message,
          reason: decision.reason,
        },
        { status: 404 }
      );
    } else {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }
  }
  return betterAuthHeaders.POST(req);
};
export { ajProtectePost as POST };
// export const { POST, GET } = toNextJsHandler(auth);
export const { GET } = betterAuthHeaders;
