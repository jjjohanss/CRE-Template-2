// Drop-in replacement for the old Base44 SDK, backed by Supabase.
// Keeps the same call shapes the app already uses:
//   api.entities.Listing.list("-created_date", 200)
//   api.entities.Listing.filter({ status: "active" }, "-price", 10)
//   api.entities.Listing.create(data) / update(id, data) / delete(id)
//   api.integrations.Core.UploadFile({ file })  -> { file_url }
//   api.functions.invoke("getTreasuryRates", {}) -> { data }
import { supabase } from "./supabaseClient";

const TABLES = {
  Broker: "brokers",
  Listing: "listings",
  NewsStory: "news_stories",
  Subscriber: "subscribers",
  OmDownload: "om_downloads",
  NdaRequest: "nda_requests",
  TeamMember: "team_members",
};

// Base44-style sort string: "-created_date" = descending, "order" = ascending
function applySort(q, sort) {
  if (!sort || typeof sort !== "string") return q;
  const desc = sort.startsWith("-");
  const col = desc ? sort.slice(1) : sort;
  return q.order(col, { ascending: !desc });
}

function unwrap({ data, error }) {
  if (error) {
    // Row Level Security blocked the write (no/expired admin session)
    if (error.code === "PGRST116" || error.code === "42501") {
      throw new Error("Permission denied. Sign out, sign back in as the admin user, and try again.");
    }
    throw new Error(error.message || "Database error");
  }
  return data;
}

// Dashboard forms send "" for empty boxes; Postgres rejects "" for number/date columns.
// Treat empty strings as NULL, and drop undefined values.
function clean(data) {
  const out = {};
  for (const [k, v] of Object.entries(data || {})) {
    if (v === undefined) continue;
    out[k] = v === "" ? null : v;
  }
  return out;
}

function makeEntity(table) {
  return {
    async list(sort, limit) {
      let q = supabase.from(table).select("*");
      q = applySort(q, sort);
      if (limit) q = q.limit(limit);
      return unwrap(await q);
    },

    // filter(query, sort, limit)  OR  filter(query, { sort, limit })
    async filter(query = {}, sortOrOpts, limit) {
      let sort = sortOrOpts;
      if (sortOrOpts && typeof sortOrOpts === "object") {
        sort = sortOrOpts.sort;
        limit = sortOrOpts.limit ?? limit;
      }
      let q = supabase.from(table).select("*");
      for (const [key, value] of Object.entries(query)) {
        if (value === null) q = q.is(key, null);
        else if (Array.isArray(value)) q = q.in(key, value);
        else q = q.eq(key, value);
      }
      q = applySort(q, sort);
      if (limit) q = q.limit(limit);
      return unwrap(await q);
    },

    async get(id) {
      return unwrap(await supabase.from(table).select("*").eq("id", id).maybeSingle());
    },

    async create(data) {
      return unwrap(await supabase.from(table).insert(clean(data)).select().single());
    },

    async update(id, data) {
      // strip fields the database manages itself
      const { id: _id, created_date, updated_date, created_by, ...rest } = data;
      return unwrap(await supabase.from(table).update(clean(rest)).eq("id", id).select().single());
    },

    async delete(id) {
      const rows = unwrap(await supabase.from(table).delete().eq("id", id).select());
      if (!rows || rows.length === 0) {
        throw new Error("Nothing was deleted. Sign out, sign back in as the admin user, and try again.");
      }
      return { success: true };
    },
  };
}

const entities = Object.fromEntries(Object.entries(TABLES).map(([name, t]) => [name, makeEntity(t)]));

// Public sign-up helpers (call SECURITY DEFINER SQL functions so visitors never read the subscriber list)
// Public summary of a sold or pending listing (see migration 006), or null.
// Returns null too if that migration hasn't been run yet, so the page falls back to "not found".
entities.Listing.closedSummary = async (id) => {
  const { data, error } = await supabase.rpc("listing_closed_summary", { p_id: id });
  if (error) {
    console.warn("listing_closed_summary:", error.message);
    return null;
  }
  return data ? { ...data, closed: true } : null;
};

entities.Subscriber.exists = async (email) =>
  unwrap(await supabase.rpc("subscriber_exists", { p_email: email }));

entities.Subscriber.signup = async (form) =>
  unwrap(
    await supabase.rpc("subscriber_signup", {
      p_first_name: form.first_name,
      p_last_name: form.last_name,
      p_email: form.email,
      p_phone: form.phone || null,
      p_company: form.company || null,
      p_job_title: form.job_title || null,
    })
  );

entities.OmDownload.log = async ({ subscriber_email, listing_id, listing_address, listing_title }) =>
  unwrap(
    await supabase.rpc("log_om_download", {
      p_email: subscriber_email,
      p_listing_id: listing_id,
      p_listing_address: listing_address || "",
      p_listing_title: listing_title || "",
    })
  );

// NDA-gated OMs: visitors talk to the "nda" Edge Function, never to the tables directly.
async function callNda(body) {
  const { data, error } = await supabase.functions.invoke("nda", { body });
  if (error) {
    let message = "Something went wrong. Please try again.";
    let status;
    try {
      const b = await error.context?.json?.();
      if (b?.error) message = b.error;
      status = b?.status;
    } catch {
      /* keep default */
    }
    throw Object.assign(new Error(message), { status });
  }
  return data;
}

const nda = {
  sign: (listingId, form, recaptchaToken) =>
    callNda({ action: "sign", listing_id: listingId, recaptcha_token: recaptchaToken, ...form }),
  status: (token) => callNda({ action: "status", token }),
  download: (token) => callNda({ action: "download", token }),
  sendLink: (listingId, email) => callNda({ action: "send-link", listing_id: listingId, email }),
};

const FUNCTIONS = {
  getTreasuryRates: "get-treasury-rates",
  verifyRecaptcha: "verify-recaptcha",
};

const functions = {
  async invoke(name, body = {}) {
    const { data, error } = await supabase.functions.invoke(FUNCTIONS[name] ?? name, { body });
    if (error) throw error;
    return { data };
  },
};

const integrations = {
  Core: {
    async UploadFile({ file }) {
      const ext = (file.name.split(".").pop() || "bin").toLowerCase();
      const path = `${new Date().getFullYear()}/${crypto.randomUUID()}.${ext}`;
      const { error } = await supabase.storage.from("uploads").upload(path, file, {
        cacheControl: "31536000",
        contentType: file.type || undefined,
      });
      if (error) throw error;
      const { data } = supabase.storage.from("uploads").getPublicUrl(path);
      return { file_url: data.publicUrl };
    },
    // NDA OMs go to the PRIVATE "nda-oms" bucket: no public link exists.
    async UploadPrivateOm({ file }) {
      const safeName = file.name.replace(/[^\w.\-]+/g, "_");
      const path = `${crypto.randomUUID()}/${safeName}`;
      const { error } = await supabase.storage.from("nda-oms").upload(path, file, {
        contentType: file.type || "application/pdf",
      });
      if (error) throw error;
      return { path, filename: file.name };
    },
  },
};

const auth = {
  async me() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw Object.assign(new Error("Not authenticated"), { status: 401 });
    return { ...user, role: user.app_metadata?.role ?? "user" };
  },
  async signIn(email, password) {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  },
  async logout() {
    await supabase.auth.signOut();
  },
};

export const api = { entities, functions, integrations, auth, nda };
