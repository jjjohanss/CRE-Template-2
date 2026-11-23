// Shared React Query definitions. Every listing query key starts with "listings", so
// invalidating ["listings"] after a save refreshes all of them (public and dashboard).
import { api } from "@/api/client";

export const listingKeys = {
  all: ["listings"],
  admin: ["listings", "admin"],          // dashboard: every status
  public: ["listings", "public"],        // website: active only
  featured: ["listings", "featured"],
  service: (slug) => ["listings", "service", slug],
  broker: (slug) => ["listings", "broker", slug],
  detail: (id) => ["listings", "detail", id],
};

// Dashboard: all listings, any status (admins only, via RLS).
export const adminListingsQuery = {
  queryKey: listingKeys.admin,
  queryFn: () => api.entities.Listing.list("-created_date", 1000),
};

// Website: active listings only. Filtered on the server so a signed-in admin
// browsing the site sees exactly what visitors see.
export const publicListingsQuery = {
  queryKey: listingKeys.public,
  queryFn: () => api.entities.Listing.filter({ status: "active" }, "-created_date", 500),
};

// Brokers, in display order. One definition so every screen shares the same cache.
export const brokersQuery = {
  queryKey: ["brokers"],
  queryFn: () => api.entities.Broker.list("order", 200),
};
