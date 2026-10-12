import "dotenv/config";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";

const app = express();
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "http://localhost:5173";

app.disable("x-powered-by");
app.use(helmet());

const allowedOrigins = new Set(
  FRONTEND_ORIGIN.split(",").map((origin) => origin.trim()).filter(Boolean)
);

app.use(cors({
  origin(origin, callback) {
    // Requests without an Origin header include server-to-server clients.
    // CORS is not authentication or an abuse-prevention mechanism.
    callback(null, !origin || allowedOrigins.has(origin));
  },
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
  maxAge: 600,
}));

app.use(express.json({ limit: "10kb", strict: true }));

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase =
  supabaseUrl && supabaseKey
    ? createClient(supabaseUrl, supabaseKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
          detectSessionInUrl: false,
        },
      })
    : null;

const waitlistLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    error: "Too many attempts. Please try again later.",
  },
});

const waitlistSchema = z.object({
  email: z.string().trim().email().max(254).transform((value) => value.toLowerCase()),
  // Hidden honeypot field; normal visitors should leave it empty.
  website: z.string().max(200).optional().default(""),
}).strict();

app.get("/api/health", (_req, res) => {
  res.set("Cache-Control", "no-store");
  res.status(200).json({
    status: "ok",
    service: "scout-api",
  });
});

app.post("/api/waitlist", waitlistLimiter, async (req, res) => {
  res.set("Cache-Control", "no-store");

  const parsed = waitlistSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      error: "Enter a valid email address.",
    });
  }

  // Don't reveal whether an email has already joined.
  const accepted = () => res.status(202).json({
    message: "If eligible, your request has been received.",
  });

  if (parsed.data.website !== "") {
    return accepted();
  }

  if (!supabase) {
    console.error("Waitlist storage is not configured.");
    return res.status(503).json({
      error: "The waitlist is temporarily unavailable.",
    });
  }

  try {
    const { error } = await supabase
      .from("waitlist")
      .insert({ email: parsed.data.email, source: "website" });

    if (error && error.code !== "23505") {
      // Do not log email addresses, request bodies, or secrets.
      console.error("Waitlist database error:", error.code || "unknown");
      return res.status(503).json({
        error: "The waitlist is temporarily unavailable.",
      });
    }

    return accepted();
  } catch {
    console.error("Waitlist request failed unexpectedly.");
    return res.status(503).json({
      error: "The waitlist is temporarily unavailable.",
    });
  }
});

// Consistent responses for oversized or malformed JSON requests.
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  if (err?.type === "entity.too.large") {
    return res.status(413).json({ error: "Request too large." });
  }

  if (err instanceof SyntaxError && "body" in err) {
    return res.status(400).json({ error: "Invalid JSON." });
  }

  console.error("Unhandled API middleware error.");
  return res.status(500).json({ error: "Internal server error." });
});

export default app;
