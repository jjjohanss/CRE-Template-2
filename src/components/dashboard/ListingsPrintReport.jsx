import React from "react";
import { Printer } from "lucide-react";
import { brokers } from "@/data/brokers";

const brokerNameBySlug = {};
brokers.forEach((b) => { brokerNameBySlug[b.slug] = b.name; });

function getBrokerNames(slugs) {
  if (!slugs || !slugs.length) return "—";
  return slugs.map((s) => brokerNameBySlug[s] || s).join(", ");
}

function daysOnMarket(listedDate) {
  if (!listedDate) return "—";
  const listed = new Date(listedDate);
  if (isNaN(listed)) return "—";
  const diff = Math.floor((Date.now() - listed) / (1000 * 60 * 60 * 24));
  return diff >= 0 ? diff : "—";
}

function fmtPrice(n) {
  if (!n && n !== 0) return "—";
  return `$${Number(n).toLocaleString()}`;
}

function fmtCapRate(n) {
  if (!n && n !== 0) return "—";
  return `${n}%`;
}

// Read YYYY-MM-DD strings without timezone shifts
function parseDate(str) {
  if (!str) return null;
  const iso = /^(\d{4})-(\d{2})-(\d{2})/.exec(str);
  if (iso) return { year: +iso[1], month: +iso[2], day: +iso[3] };
  const d = new Date(str);
  if (isNaN(d)) return null;
  return { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() };
}

function fmtDate(str) {
  const p = parseDate(str);
  if (!p) return "—";
  return `${String(p.month).padStart(2, "0")}/${String(p.day).padStart(2, "0")}/${p.year}`;
}

const QUARTERS = ["Q1", "Q2", "Q3", "Q4"];
const YEAR = new Date().getFullYear();

function quarterOf(closingDate) {
  const p = parseDate(closingDate);
  if (!p || p.year !== YEAR) return null;
  return Math.floor((p.month - 1) / 3);
}

const sumPrice = (rows) => rows.reduce((s, l) => s + (l.price || 0), 0);

function buildRow(l) {
  return `
    <tr>
      <td>${l.listing_number || "—"}</td>
      <td>${l.title || l.address || "—"}</td>
      <td>${l.city || "—"}</td>
      <td>${l.state || "—"}</td>
      <td>${l.property_type || "—"}</td>
      <td style="text-align:right">${fmtPrice(l.price)}</td>
      <td style="text-align:right">${fmtCapRate(l.cap_rate)}</td>
      <td>${l.coe_psa || "—"}</td>
      <td>${getBrokerNames(l.brokers)}</td>
      <td style="text-align:right">${l.offers != null ? l.offers : "—"}</td>
      <td style="text-align:right">${daysOnMarket(l.listed_date)}</td>
    </tr>`;
}

function buildSection(title, rows) {
  if (!rows.length) {
    return `
      <h2>${title}</h2>
      <p class="empty">No properties in this category.</p>`;
  }
  return `
    <h2>${title} <span class="count">(${rows.length})</span></h2>
    <table>
      <thead>
        <tr>
          <th>Listing #</th>
          <th>Property Name</th>
          <th>City</th>
          <th>State</th>
          <th>Type</th>
          <th style="text-align:right">Price</th>
          <th style="text-align:right">Cap Rate</th>
          <th>Cap/COE</th>
          <th>Agents</th>
          <th style="text-align:right">Offers</th>
          <th style="text-align:right">Days on Market</th>
        </tr>
      </thead>
      <tbody>
        ${rows.map(buildRow).join("")}
      </tbody>
    </table>`;
}

function buildSaleRow(l) {
  return `
    <tr>
      <td>${l.listing_number || "—"}</td>
      <td>${l.title || l.address || "—"}</td>
      <td>${l.city || "—"}</td>
      <td>${l.state || "—"}</td>
      <td>${l.property_type || "—"}</td>
      <td>${fmtDate(l.closing_date)}</td>
      <td style="text-align:right">${fmtPrice(l.price)}</td>
      <td style="text-align:right">${fmtCapRate(l.cap_rate)}</td>
      <td>${getBrokerNames(l.brokers)}</td>
      <td style="text-align:right">${l.offers != null ? l.offers : "—"}</td>
    </tr>`;
}

function buildQuarterSection(label, rows) {
  if (!rows.length) {
    return `
      <h2>${label} ${YEAR} <span class="count">(0)</span></h2>
      <p class="empty">No closings in this quarter.</p>`;
  }
  return `
    <h2>${label} ${YEAR} <span class="count">(${rows.length})</span></h2>
    <table>
      <thead>
        <tr>
          <th>Listing #</th>
          <th>Property Name</th>
          <th>City</th>
          <th>State</th>
          <th>Type</th>
          <th>Close Date</th>
          <th style="text-align:right">Sale Price</th>
          <th style="text-align:right">Cap Rate</th>
          <th>Agents</th>
          <th style="text-align:right">Offers</th>
        </tr>
      </thead>
      <tbody>
        ${rows.map(buildSaleRow).join("")}
      </tbody>
      <tfoot>
        <tr class="total">
          <td colspan="6">${label} Total — ${rows.length} sale${rows.length !== 1 ? "s" : ""}</td>
          <td style="text-align:right">${fmtPrice(sumPrice(rows))}</td>
          <td colspan="3"></td>
        </tr>
      </tfoot>
    </table>`;
}

export function generateListingsPrintReport(listings) {
  const active = listings.filter((l) => l.status === "active");
  const pending = listings.filter((l) => l.status === "pending");
  const sold = listings.filter((l) => l.status === "sold");

  const byQuarter = QUARTERS.map((_, i) => sold.filter((l) => quarterOf(l.closing_date) === i));
  const undated = sold.filter((l) => !parseDate(l.closing_date));

  const soldThisYear = byQuarter.flat();
  const yearVolume = sumPrice(soldThisYear) + sumPrice(undated);

  const now = new Date().toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  });

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Faris Lee Properties — Listings Report</title>
  <style>
    * { box-sizing: border-box; }
    body { font-family: 'Inter', Arial, sans-serif; color: #1a1a1a; margin: 32px; font-size: 11px; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #C8102E; padding-bottom: 12px; margin-bottom: 20px; }
    .header h1 { font-size: 18px; margin: 0; }
    .header .meta { text-align: right; font-size: 11px; color: #555; }
    .summary { display: flex; gap: 12px; margin-bottom: 24px; }
    .summary .card { flex: 1; border: 1px solid #ddd; border-radius: 6px; padding: 10px 12px; }
    .summary .card .label { font-size: 9px; text-transform: uppercase; letter-spacing: 0.05em; color: #888; margin-bottom: 4px; }
    .summary .card .value { font-size: 16px; font-weight: 700; color: #1a1a1a; }
    h2 { font-size: 13px; margin: 24px 0 8px; padding-bottom: 4px; border-bottom: 1px solid #ccc; }
    h2 .count { font-weight: 400; color: #888; font-size: 11px; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 8px; }
    th { background: #f5f5f5; text-align: left; padding: 6px 8px; font-size: 9px; text-transform: uppercase; letter-spacing: 0.03em; color: #555; border-bottom: 1px solid #ddd; }
    td { padding: 5px 8px; border-bottom: 1px solid #eee; font-size: 10px; }
    tr:nth-child(even) td { background: #fafafa; }
    tfoot tr.total td { background: #eef0f3; font-weight: 700; border-top: 2px solid #ccd0d6; border-bottom: none; }
    .year-total { margin: 4px 0 8px; padding: 10px 12px; border: 1px solid #ccd0d6; background: #f5f6f8; border-radius: 6px; display: flex; justify-content: space-between; font-weight: 700; font-size: 12px; }
    .empty { color: #999; font-style: italic; padding: 8px 0; }
    @media print { body { margin: 12px; } .summary { flex-wrap: nowrap; } }
  </style>
</head>
<body>
  <div class="header">
    <h1>Faris Lee Properties — Listings Report</h1>
    <div class="meta">
      <div>Generated ${now}</div>
      <div>Sales Year ${YEAR}</div>
    </div>
  </div>

  <div class="summary">
    <div class="card">
      <div class="label">Available</div>
      <div class="value">${active.length}</div>
    </div>
    <div class="card">
      <div class="label">In Escrow</div>
      <div class="value">${pending.length}</div>
    </div>
    <div class="card">
      <div class="label">Sales ${YEAR}</div>
      <div class="value">${soldThisYear.length + undated.length}</div>
    </div>
    <div class="card">
      <div class="label">Closed Volume ${YEAR}</div>
      <div class="value">${fmtPrice(yearVolume)}</div>
    </div>
  </div>

  ${buildSection("In Escrow", pending)}
  ${buildSection("Available", active)}

  <h1 style="font-size:15px;margin:24px 0 0;">Sales by Quarter — ${YEAR}</h1>
  ${[3, 2, 1, 0].map((i) => buildQuarterSection(QUARTERS[i], byQuarter[i])).join("")}
  ${undated.length ? `
  <h2>Closed — Date Not Recorded <span class="count">(${undated.length})</span></h2>
  <table>
    <thead>
      <tr>
        <th>Listing #</th>
        <th>Property Name</th>
        <th>City</th>
        <th>State</th>
        <th>Type</th>
        <th>Close Date</th>
        <th style="text-align:right">Sale Price</th>
        <th style="text-align:right">Cap Rate</th>
        <th>Agents</th>
        <th style="text-align:right">Offers</th>
      </tr>
    </thead>
    <tbody>${undated.map(buildSaleRow).join("")}</tbody>
    <tfoot>
      <tr class="total">
        <td colspan="6">Total — ${undated.length} sale${undated.length !== 1 ? "s" : ""}</td>
        <td style="text-align:right">${fmtPrice(sumPrice(undated))}</td>
        <td colspan="3"></td>
      </tr>
    </tfoot>
  </table>` : ""}

  <div class="year-total">
    <span>Total ${YEAR} Sales — ${soldThisYear.length + undated.length} propert${soldThisYear.length + undated.length === 1 ? "y" : "ies"}</span>
    <span>${fmtPrice(yearVolume)}</span>
  </div>

</body>
</html>`;

  const win = window.open("", "_blank");
  if (!win) {
    alert("Please allow popups to print the report.");
    return;
  }
  win.document.write(html);
  win.document.close();
  win.focus();
  setTimeout(() => {
    win.print();
  }, 400);
}

export default function ListingsPrintButton({ listings }) {
  return (
    <button
      onClick={() => generateListingsPrintReport(listings)}
      className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white text-sm font-semibold rounded-lg hover:bg-slate-900 transition-colors shadow-sm flex-shrink-0"
    >
      <Printer size={16} />
      Print Report
    </button>
  );
}