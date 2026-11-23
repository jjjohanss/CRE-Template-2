// Supabase Edge Function: get-treasury-rates (ported from Base44 getTreasuryRates)
const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  try {
    const currentYear = new Date().getFullYear();
    const yearData: Record<number, any[]> = {};

    for (const yr of [currentYear, currentYear - 1]) {
      const url = `https://home.treasury.gov/resource-center/data-chart-center/interest-rates/pages/xml?data=daily_treasury_yield_curve&field_tdr_date_value=${yr}`;
      const res = await fetch(url);
      if (!res.ok) continue;
      const xml = await res.text();
      const entries = xml.split("<entry>").slice(1);
      const parsed: any[] = [];
      for (const entry of entries) {
        const d = entry.match(/<(?:\w+:)?NEW_DATE[^>]*>([^<]+)<\/(?:\w+:)?NEW_DATE>/);
        const y5 = entry.match(/<(?:\w+:)?BC_5YEAR[^>]*>([^<]+)<\/(?:\w+:)?BC_5YEAR>/);
        const y10 = entry.match(/<(?:\w+:)?BC_10YEAR[^>]*>([^<]+)<\/(?:\w+:)?BC_10YEAR>/);
        const y30 = entry.match(/<(?:\w+:)?BC_30YEAR[^>]*>([^<]+)<\/(?:\w+:)?BC_30YEAR>/);
        if (d) parsed.push({
          date: d[1].split("T")[0],
          y5: y5 ? parseFloat(y5[1]) : null,
          y10: y10 ? parseFloat(y10[1]) : null,
          y30: y30 ? parseFloat(y30[1]) : null,
        });
      }
      yearData[yr] = parsed;
      if (parsed.length >= 2) break;
    }

    const all = [...(yearData[currentYear - 1] || []), ...(yearData[currentYear] || [])];
    if (all.length === 0) return json({ error: "No treasury data available" }, 502);

    const latest = all[all.length - 1];
    const prev = all.length > 1 ? all[all.length - 2] : null;
    const change = (a: number | null, b: number | null | undefined) =>
      a == null || b == null ? null : Math.round((a - b) * 1000) / 1000;

    return json({
      date: latest.date,
      rates: { y5: latest.y5, y10: latest.y10, y30: latest.y30 },
      changes: { y5: change(latest.y5, prev?.y5), y10: change(latest.y10, prev?.y10), y30: change(latest.y30, prev?.y30) },
    });
  } catch (e) {
    return json({ error: (e as Error).message }, 500);
  }
});
