import React from "react";
import { Building2, Clock, DollarSign, MessageSquare, TrendingUp } from "lucide-react";

export default function DashboardMetrics({ listings }) {
  const active = listings.filter((l) => l.status === "active").length;
  const pending = listings.filter((l) => l.status === "pending").length;
  const sold = listings.filter((l) => l.status === "sold");

  const totalRevenue = sold.reduce((sum, l) => {
    const commission = (l.commission_rate ?? 2.5) / 100;
    return sum + (l.price ?? 0) * commission;
  }, 0);

  const recentInquiries = listings.filter((l) => {
    const created = new Date(l.created_date);
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    return created > sevenDaysAgo;
  }).length;

  const metrics = [
    {
      label: "Active Listings",
      value: active,
      icon: Building2,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
      sub: `${listings.length} total properties`,
      trend: "+2 this week",
      trendUp: true,
    },
    {
      label: "Pending Sales",
      value: pending,
      icon: Clock,
      iconBg: "bg-amber-50",
      iconColor: "text-amber-600",
      sub: "Awaiting close",
      trend: `${pending > 0 ? pending : "0"} in escrow`,
      trendUp: false,
    },
    {
      label: "Commission Revenue",
      value: `$${(totalRevenue / 1000).toFixed(0)}k`,
      icon: DollarSign,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
      sub: `From ${sold.length} closed deals`,
      trend: "+12% vs last month",
      trendUp: true,
    },
    {
      label: "Recent Inquiries",
      value: recentInquiries,
      icon: MessageSquare,
      iconBg: "bg-violet-50",
      iconColor: "text-violet-600",
      sub: "Last 7 days",
      trend: "New leads",
      trendUp: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {metrics.map((m, i) => (
        <div
          key={i}
          className="bg-white rounded-xl shadow-sm border border-slate-100 p-5 flex flex-col gap-3 hover:shadow-md transition-shadow duration-200"
        >
          <div className="flex items-center justify-between">
            <p className="text-slate-500 text-sm font-medium">{m.label}</p>
            <div className={`w-9 h-9 rounded-lg ${m.iconBg} flex items-center justify-center`}>
              <m.icon className={`w-4.5 h-4.5 ${m.iconColor}`} size={18} />
            </div>
          </div>
          <div>
            <p className="text-slate-900 text-3xl font-bold tracking-tight">{m.value}</p>
            <p className="text-slate-400 text-xs mt-1">{m.sub}</p>
          </div>
          <div className={`flex items-center gap-1 text-xs font-medium ${m.trendUp ? "text-emerald-600" : "text-amber-600"}`}>
            <TrendingUp size={12} />
            {m.trend}
          </div>
        </div>
      ))}
    </div>
  );
}