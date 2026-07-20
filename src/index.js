const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const VALID_IDEAS = new Set(["shiplog", "saveflow", "clientloop"]);

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/signup" && request.method === "POST") {
      return handleSignup(request, env);
    }

    return env.ASSETS.fetch(request);
  },
};

async function handleSignup(request, env) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Malformed request." }, { status: 400 });
  }

  const { idea, email } = body ?? {};

  if (!VALID_IDEAS.has(idea)) {
    return Response.json({ error: "Unknown idea." }, { status: 400 });
  }
  if (typeof email !== "string" || !EMAIL_RE.test(email)) {
    return Response.json({ error: "Enter a valid email." }, { status: 400 });
  }

  const key = `${idea}:${Date.now()}:${crypto.randomUUID()}`;
  await env.SIGNUPS.put(key, JSON.stringify({ idea, email, ts: Date.now() }));

  return Response.json({ ok: true });
}
