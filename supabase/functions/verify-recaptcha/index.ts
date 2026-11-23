// Supabase Edge Function: verify-recaptcha (ported from Base44 verifyRecaptcha)
// Set the secret first:  supabase secrets set RECAPTCHA_SECRET_KEY=your_secret
const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  try {
    const { token } = await req.json();
    if (!token) return json({ success: false, error: "No reCAPTCHA token provided" }, 400);

    const secret = Deno.env.get("RECAPTCHA_SECRET_KEY");
    if (!secret) return json({ success: false, error: "Server missing RECAPTCHA_SECRET_KEY" }, 500);

    const r = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret, response: token }),
    });
    const data = await r.json();
    return json({ success: !!data.success });
  } catch (e) {
    return json({ success: false, error: (e as Error).message }, 500);
  }
});
