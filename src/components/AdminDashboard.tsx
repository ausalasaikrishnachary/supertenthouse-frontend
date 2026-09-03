// import React from "react";
// import {
//   Search,
//   Bell,
//   ChevronDown,
//   SlidersHorizontal,
//   ArrowUpRight,
//   ArrowDownRight,
//   MoreVertical,
//   Wallet,
//   ShoppingBag,
//   Users,
//   Receipt,
//   PlusCircle,
//   ClipboardList,
//   UserPlus,
//   FileDown,
//   ArrowRight,
// } from "lucide-react";
// import {
//   ResponsiveContainer,
//   AreaChart,
//   Area,
//   XAxis,
//   Tooltip,
//   CartesianGrid,
// } from "recharts";
// import Navbar from "@/components/Navbar";

// /* -------------------------------------------------------------------------
//    Mock data — swap these arrays for real data from your API/store.
// ------------------------------------------------------------------------- */

// type TrendDirection = "up" | "down";

// interface OverviewStat {
//   id: string;
//   label: string;
//   value: string;
//   delta: string;
//   trend: TrendDirection;
//   compare: string;
//   icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
//   accent: string;
//   spark: number[];
// }

// const overviewStats: OverviewStat[] = [
//   {
//     id: "revenue",
//     label: "Total Revenue",
//     value: "₹2,45,890",
//     delta: "12.5%",
//     trend: "up",
//     compare: "vs Apr 12 – May 12",
//     icon: Wallet,
//     accent: "sd-accent-violet",
//     spark: [4, 6, 5, 8, 7, 10, 9, 12, 11, 14],
//   },
//   {
//     id: "orders",
//     label: "Total Orders",
//     value: "1,240",
//     delta: "8.4%",
//     trend: "up",
//     compare: "vs Apr 12 – May 12",
//     icon: ShoppingBag,
//     accent: "sd-accent-green",
//     spark: [3, 4, 4, 6, 5, 7, 8, 7, 9, 10],
//   },
//   {
//     id: "customers",
//     label: "Total Customers",
//     value: "860",
//     delta: "10.2%",
//     trend: "up",
//     compare: "vs Apr 12 – May 12",
//     icon: Users,
//     accent: "sd-accent-amber",
//     spark: [5, 5, 6, 6, 7, 8, 7, 9, 10, 11],
//   },
//   {
//     id: "aov",
//     label: "Avg. Order Value",
//     value: "₹1,985",
//     delta: "3.2%",
//     trend: "down",
//     compare: "vs Apr 12 – May 12",
//     icon: Receipt,
//     accent: "sd-accent-rose",
//     spark: [10, 9, 10, 8, 9, 7, 8, 6, 7, 6],
//   },
// ];

// const salesSeries = [
//   { month: "Jan", value: 62000 },
//   { month: "Feb", value: 78000 },
//   { month: "Mar", value: 121000 },
//   { month: "Apr", value: 96000 },
//   { month: "May", value: 145690 },
//   { month: "Jun", value: 88000 },
//   { month: "Jul", value: 132000 },
//   { month: "Aug", value: 118000 },
//   { month: "Sep", value: 150000 },
//   { month: "Oct", value: 128000 },
//   { month: "Nov", value: 96000 },
//   { month: "Dec", value: 84000 },
// ];

// type OrderStatus = "Delivered" | "Pending" | "Shipped" | "Cancelled";

// interface Order {
//   id: string;
//   customer: string;
//   product: string;
//   amount: string;
//   status: OrderStatus;
//   image: string;
// }

// const recentOrders: Order[] = [
//   { id: "#1021", customer: "Kajal Verma", product: "Floral Dress", amount: "₹1,299", status: "Delivered", image: "https://picsum.photos/seed/floral-dress/80/80" },
//   { id: "#1022", customer: "Riya Singh", product: "Oversized Tee", amount: "₹899", status: "Pending", image: "https://picsum.photos/seed/oversized-tee/80/80" },
//   { id: "#1023", customer: "Neha Kapoor", product: "Denim Jacket", amount: "₹2,199", status: "Shipped", image: "https://picsum.photos/seed/denim-jacket/80/80" },
//   { id: "#1024", customer: "Pooja Mehta", product: "Black Top", amount: "₹699", status: "Cancelled", image: "https://picsum.photos/seed/black-top/80/80" },
//   { id: "#1025", customer: "Arjun Patel", product: "Linen Shirt", amount: "₹1,499", status: "Delivered", image: "https://picsum.photos/seed/linen-shirt/80/80" },
// ];

// interface TopProduct {
//   rank: number;
//   name: string;
//   sales: number;
//   image: string;
// }

// const topProducts: TopProduct[] = [
//   { rank: 1, name: "Summer Dress", sales: 120, image: "https://picsum.photos/seed/summer-dress/80/80" },
//   { rank: 2, name: "Denim Jacket", sales: 95, image: "https://picsum.photos/seed/denim-jacket-2/80/80" },
//   { rank: 3, name: "Oversized Tee", sales: 80, image: "https://picsum.photos/seed/oversized-tee-2/80/80" },
//   { rank: 4, name: "Linen Shirt", sales: 60, image: "https://picsum.photos/seed/linen-shirt-2/80/80" },
//   { rank: 5, name: "Cargo Pants", sales: 45, image: "https://picsum.photos/seed/cargo-pants/80/80" },
// ];
// const topProductsMax = Math.max(...topProducts.map((p) => p.sales));

// interface QuickAction {
//   id: string;
//   label: string;
//   helper: string;
//   icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
//   accent: string;
// }

// const quickActions: QuickAction[] = [
//   { id: "add-product", label: "Add New Product", helper: "Add a new product to your store", icon: PlusCircle, accent: "sd-qa-violet" },
//   { id: "create-order", label: "Create New Order", helper: "Add a new customer order", icon: ClipboardList, accent: "sd-qa-green" },
//   { id: "add-staff", label: "Add New Staff", helper: "Invite and add new staff member", icon: UserPlus, accent: "sd-qa-amber" },
//   { id: "generate-report", label: "Generate Report", helper: "Download store reports", icon: FileDown, accent: "sd-qa-blue" },
// ];

// const statusStyles: Record<OrderStatus, string> = {
//   Delivered: "sd-status-delivered",
//   Pending: "sd-status-pending",
//   Shipped: "sd-status-shipped",
//   Cancelled: "sd-status-cancelled",
// };

// /* -------------------------------------------------------------------------
//    Small reusable bits
// ------------------------------------------------------------------------- */

// function Sparkline({ data, colorClass }: { data: number[]; colorClass: string }) {
//   const max = Math.max(...data);
//   const min = Math.min(...data);
//   const points = data
//     .map((v, i) => {
//       const x = (i / (data.length - 1)) * 100;
//       const y = 100 - ((v - min) / (max - min || 1)) * 100;
//       return `${x},${y}`;
//     })
//     .join(" ");
//   return (
//     <svg className={`sd-sparkline ${colorClass}`} viewBox="0 0 100 100" preserveAspectRatio="none">
//       <polyline points={points} fill="none" strokeWidth="6" />
//     </svg>
//   );
// }

// function StatCard({ stat }: { stat: OverviewStat }) {
//   const Icon = stat.icon;
//   const TrendIcon = stat.trend === "up" ? ArrowUpRight : ArrowDownRight;
//   return (
//     <div className={`sd-stat-card sd-stat-card--${stat.id}`}>
//       <div className="sd-stat-card__top">
//         <span className={`sd-stat-card__icon ${stat.accent}`}>
//           <Icon size={18} strokeWidth={2.25} />
//         </span>
//         <span className="sd-stat-card__label">{stat.label}</span>
//       </div>

//       <div className="sd-stat-card__body">
//         <div className="sd-stat-card__value-block">
//           <p className="sd-stat-card__value">{stat.value}</p>
//           <div className={`sd-stat-card__delta sd-stat-card__delta--${stat.trend}`}>
//             <TrendIcon size={14} strokeWidth={2.5} />
//             <span>{stat.delta}</span>
//           </div>
//           <p className="sd-stat-card__compare">{stat.compare}</p>
//         </div>
//         <Sparkline data={stat.spark} colorClass={`sd-sparkline--${stat.trend === "up" ? "up" : "down"}`} />
//       </div>
//     </div>
//   );
// }

// function SalesTooltip({ active, payload, label }: any) {
//   if (!active || !payload?.length) return null;
//   return (
//     <div className="sd-chart-tooltip">
//       <p className="sd-chart-tooltip__label">{label} 2024</p>
//       <p className="sd-chart-tooltip__value">₹{payload[0].value.toLocaleString("en-IN")}</p>
//     </div>
//   );
// }

// /* -------------------------------------------------------------------------
//    Main component
// ------------------------------------------------------------------------- */

// interface AdminDashboardProps {
//   storeOwnerName?: string;
// }

// export default function AdminDashboard({ storeOwnerName = "Ankit" }: AdminDashboardProps) {
//   return (
//     <div className="sd-dashboard">
//       <Navbar />

//       <div className="sd-dashboard__inner">
//         {/* Header */}
//         <header className="sd-header">
//           <div className="sd-header__greeting">
//             <h1 className="sd-header__title">
//               Good morning, {storeOwnerName} <span className="sd-header__wave">👋</span>
//             </h1>
//             <p className="sd-header__subtitle">Here's what's happening with your store today.</p>
//           </div>

//           <div className="sd-header__actions">
//             <label className="sd-search">
//               <Search size={16} className="sd-search__icon" />
//               <input type="text" placeholder="Search anything..." className="sd-search__input" />
//               <kbd className="sd-search__kbd">⌘K</kbd>
//             </label>

//             <button type="button" className="sd-icon-button sd-header__bell">
//               <Bell size={18} />
//               <span className="sd-icon-button__dot" />
//             </button>

//             {/* <button type="button" className="sd-header__profile">
//               <img className="sd-header__avatar" src="https://i.pravatar.cc/72?img=12" alt="" />
//               <span className="sd-header__profile-text">
//                 <span className="sd-header__profile-name">Ankit Sharma</span>
//                 <span className="sd-header__profile-role">Store Owner</span>
//               </span>
//             </button> */}
//           </div>
//         </header>

//         {/* Overview */}
//         <section className="sd-section sd-overview">
//           <div className="sd-section__header">
//             <h2 className="sd-section__title">Overview</h2>
//             <div className="sd-overview__controls">
//               <button type="button" className="sd-pill-button">
//                 <span>May 12 – Jun 12, 2024</span>
//                 <ChevronDown size={14} />
//               </button>
//               <button type="button" className="sd-pill-button sd-pill-button--ghost">
//                 <SlidersHorizontal size={14} />
//                 <span>Filter</span>
//               </button>
//             </div>
//           </div>

//           <div className="sd-overview__grid">
//             {overviewStats.map((stat) => (
//               <StatCard key={stat.id} stat={stat} />
//             ))}
//           </div>
//         </section>

//         {/* Sales overview + Recent orders */}
//         <section className="sd-section sd-grid-2col">
//           <div className="sd-panel sd-sales-panel">
//             <div className="sd-panel__header">
//               <h3 className="sd-panel__title">Sales Overview</h3>
//               <div className="sd-sales-panel__controls">
//                 <button type="button" className="sd-pill-button sd-pill-button--sm">
//                   <span>Monthly</span>
//                   <ChevronDown size={13} />
//                 </button>
//                 <button type="button" className="sd-icon-button sd-icon-button--ghost">
//                   <MoreVertical size={16} />
//                 </button>
//               </div>
//             </div>

//             <div className="sd-sales-panel__chart">
//               <ResponsiveContainer width="100%" height="100%">
//                 <AreaChart data={salesSeries} margin={{ top: 30, right: 8, bottom: 0, left: 0 }}>
//                   <defs>
//                     <linearGradient id="sdSalesFill" x1="0" y1="0" x2="0" y2="1">
//                       <stop offset="0%" stopColor="#7C6AF0" stopOpacity={0.35} />
//                       <stop offset="100%" stopColor="#7C6AF0" stopOpacity={0} />
//                     </linearGradient>
//                   </defs>
//                   <CartesianGrid vertical={false} stroke="#EEF0F4" />
//                   <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#9AA1AF", fontSize: 12 }} dy={8} />
//                   <Tooltip content={<SalesTooltip />} cursor={{ stroke: "#D8D2FB", strokeWidth: 1 }} />
//                   <Area
//                     type="monotone"
//                     dataKey="value"
//                     stroke="#6C5CE7"
//                     strokeWidth={2.5}
//                     fill="url(#sdSalesFill)"
//                     activeDot={{ r: 5, fill: "#6C5CE7", stroke: "#fff", strokeWidth: 2 }}
//                   />
//                 </AreaChart>
//               </ResponsiveContainer>
//             </div>
//           </div>

//           <div className="sd-panel sd-orders-panel">
//             <div className="sd-panel__header">
//               <h3 className="sd-panel__title">Recent Orders</h3>
//               <button type="button" className="sd-link-button">
//                 View all <ArrowRight size={13} />
//               </button>
//             </div>

//             <table className="sd-orders-table">
//               <thead>
//                 <tr>
//                   <th>Order ID</th>
//                   <th>Customer</th>
//                   <th>Product</th>
//                   <th>Amount</th>
//                   <th>Status</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {recentOrders.map((order) => (
//                   <tr key={order.id} className="sd-orders-table__row">
//                     <td className="sd-orders-table__id">{order.id}</td>
//                     <td>{order.customer}</td>
//                     <td className="sd-orders-table__product">
//                       <img className="sd-orders-table__swatch" src={order.image} alt={order.product} />
//                       {order.product}
//                     </td>
//                     <td>{order.amount}</td>
//                     <td>
//                       <span className={`sd-status-badge ${statusStyles[order.status]}`}>{order.status}</span>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </section>

//         {/* Top products + Quick actions */}
//         <section className="sd-section sd-grid-2col-even">
//           <div className="sd-panel sd-products-panel">
//             <div className="sd-panel__header">
//               <h3 className="sd-panel__title">Top Products</h3>
//               <button type="button" className="sd-link-button">
//                 View all <ArrowRight size={13} />
//               </button>
//             </div>
//             <ul className="sd-products-list">
//               {topProducts.map((product) => (
//                 <li key={product.rank} className="sd-products-list__item">
//                   <span className="sd-products-list__rank">{product.rank}</span>
//                   <img className="sd-products-list__thumb" src={product.image} alt={product.name} />
//                   <div className="sd-products-list__info">
//                     <span className="sd-products-list__name">{product.name}</span>
//                     <div className="sd-products-list__bar-track">
//                       <div
//                         className="sd-products-list__bar-fill"
//                         style={{ width: `${(product.sales / topProductsMax) * 100}%` }}
//                       />
//                     </div>
//                   </div>
//                   <span className="sd-products-list__sales">{product.sales} sales</span>
//                 </li>
//               ))}
//             </ul>
//           </div>

//           <div className="sd-panel sd-actions-panel">
//             <div className="sd-panel__header">
//               <h3 className="sd-panel__title">Quick Actions</h3>
//             </div>
//             <ul className="sd-actions-list">
//               {quickActions.map((action) => {
//                 const Icon = action.icon;
//                 return (
//                   <li key={action.id}>
//                     <button type="button" className="sd-actions-list__item">
//                       <span className={`sd-actions-list__icon ${action.accent}`}>
//                         <Icon size={18} strokeWidth={2.25} />
//                       </span>
//                       <span className="sd-actions-list__text">
//                         <span className="sd-actions-list__label">{action.label}</span>
//                         <span className="sd-actions-list__helper">{action.helper}</span>
//                       </span>
//                       <ArrowRight size={15} className="sd-actions-list__arrow" />
//                     </button>
//                   </li>
//                 );
//               })}
//             </ul>
//           </div>
//         </section>
//       </div>

//       <style>{`
//         .sd-dashboard {
//           --sd-bg: #F5F6FA;
//           --sd-surface: #FFFFFF;
//           --sd-border: #ECEEF3;
//           --sd-text: #1E2130;
//           --sd-text-muted: #8B90A0;
//           --sd-text-faint: #ADB1C0;
//           --sd-violet: #6C5CE7;
//           --sd-violet-tint: #EFECFD;
//           --sd-green: #14B872;
//           --sd-green-tint: #E4F8EE;
//           --sd-amber: #F5A524;
//           --sd-amber-tint: #FEF3E0;
//           --sd-rose: #F0446A;
//           --sd-rose-tint: #FDE9EE;
//           --sd-blue: #3B82F6;
//           --sd-blue-tint: #E8F1FE;
//           --sd-radius-lg: 20px;
//           --sd-radius-md: 14px;
//           --sd-radius-sm: 10px;
//           font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
//           background: var(--sd-bg);
//           color: var(--sd-text);
//           min-height: 100vh;
//           padding: 0;
//           box-sizing: border-box;
//         }
//         .sd-dashboard *, .sd-dashboard *::before, .sd-dashboard *::after {
//           box-sizing: border-box;
//         }
        
//         /* Navbar wrapper - ensure no extra spacing */
//         .sd-dashboard > nav:first-child {
//           margin: 0;
//           padding: 0;
//           width: 100%;
//           flex-shrink: 0;
//         }
        
//         .sd-dashboard__inner {
//           max-width: 1320px;
//           margin: 0 auto;
//           padding: 28px;
//           display: flex;
//           flex-direction: column;
//           gap: 24px;
//         }

//         /* Header */
//         .sd-header {
//           display: flex;
//           align-items: center;
//           justify-content: space-between;
//           gap: 20px;
//           flex-wrap: wrap;
//         }
//         .sd-header__title {
//           margin: 0;
//           font-size: 24px;
//           font-weight: 700;
//           letter-spacing: -0.02em;
//         }
//         .sd-header__wave { display: inline-block; }
//         .sd-header__subtitle {
//           margin: 4px 0 0;
//           color: var(--sd-text-muted);
//           font-size: 14px;
//         }
//         .sd-header__actions {
//           display: flex;
//           align-items: center;
//           gap: 14px;
//         }
//         .sd-search {
//           display: flex;
//           align-items: center;
//           gap: 8px;
//           background: var(--sd-surface);
//           border: 1px solid var(--sd-border);
//           border-radius: 999px;
//           padding: 10px 14px;
//           width: 260px;
//         }
//         .sd-search__icon { color: var(--sd-text-faint); flex-shrink: 0; }
//         .sd-search__input {
//           border: none;
//           outline: none;
//           background: transparent;
//           font-size: 13px;
//           width: 100%;
//           color: var(--sd-text);
//         }
//         .sd-search__input::placeholder { color: var(--sd-text-faint); }
//         .sd-search__kbd {
//           font-size: 11px;
//           color: var(--sd-text-faint);
//           background: var(--sd-bg);
//           border-radius: 6px;
//           padding: 2px 6px;
//         }
//         .sd-icon-button {
//           position: relative;
//           display: inline-flex;
//           align-items: center;
//           justify-content: center;
//           width: 40px;
//           height: 40px;
//           border-radius: 50%;
//           border: 1px solid var(--sd-border);
//           background: var(--sd-surface);
//           color: var(--sd-text);
//           cursor: pointer;
//         }
//         .sd-icon-button--ghost {
//           width: 32px;
//           height: 32px;
//           border: none;
//           color: var(--sd-text-muted);
//         }
//         .sd-icon-button__dot {
//           position: absolute;
//           top: 9px;
//           right: 10px;
//           width: 7px;
//           height: 7px;
//           border-radius: 50%;
//           background: var(--sd-rose);
//           border: 1.5px solid var(--sd-surface);
//         }
//         .sd-header__profile {
//           display: flex;
//           align-items: center;
//           gap: 10px;
//           background: var(--sd-surface);
//           border: 1px solid var(--sd-border);
//           border-radius: 999px;
//           padding: 6px 14px 6px 6px;
//           cursor: pointer;
//         }
//         .sd-header__avatar {
//           width: 32px;
//           height: 32px;
//           border-radius: 50%;
//           object-fit: cover;
//         }
//         .sd-header__profile-text {
//           display: flex;
//           flex-direction: column;
//           align-items: flex-start;
//           line-height: 1.2;
//         }
//         .sd-header__profile-name { font-size: 13px; font-weight: 600; }
//         .sd-header__profile-role { font-size: 11px; color: var(--sd-text-muted); }

//         /* Section shell */
//         .sd-section { display: flex; flex-direction: column; gap: 16px; }
//         .sd-section__header {
//           display: flex;
//           align-items: center;
//           justify-content: space-between;
//           flex-wrap: wrap;
//           gap: 12px;
//         }
//         .sd-section__title {
//           margin: 0;
//           font-size: 17px;
//           font-weight: 700;
//         }
//         .sd-overview__controls { display: flex; gap: 10px; }
//         .sd-pill-button {
//           display: inline-flex;
//           align-items: center;
//           gap: 6px;
//           font-size: 13px;
//           font-weight: 500;
//           color: var(--sd-text);
//           background: var(--sd-surface);
//           border: 1px solid var(--sd-border);
//           border-radius: 10px;
//           padding: 8px 12px;
//           cursor: pointer;
//         }
//         .sd-pill-button--ghost { color: var(--sd-text-muted); }
//         .sd-pill-button--sm { padding: 6px 10px; font-size: 12px; }

//         /* Stat cards */
//         .sd-overview__grid {
//           display: grid;
//           grid-template-columns: repeat(4, 1fr);
//           gap: 18px;
//         }
//         .sd-stat-card {
//           background: var(--sd-surface);
//           border: 1px solid var(--sd-border);
//           border-radius: var(--sd-radius-lg);
//           padding: 18px;
//         }
//         .sd-stat-card__top {
//           display: flex;
//           align-items: center;
//           gap: 10px;
//           margin-bottom: 14px;
//         }
//         .sd-stat-card__icon {
//           display: inline-flex;
//           align-items: center;
//           justify-content: center;
//           width: 34px;
//           height: 34px;
//           border-radius: 10px;
//           color: #fff;
//         }
//         .sd-accent-violet { background: var(--sd-violet); }
//         .sd-accent-green { background: var(--sd-green); }
//         .sd-accent-amber { background: var(--sd-amber); }
//         .sd-accent-rose { background: var(--sd-rose); }
//         .sd-stat-card__label { font-size: 13px; color: var(--sd-text-muted); font-weight: 500; }
//         .sd-stat-card__body {
//           display: flex;
//           align-items: flex-end;
//           justify-content: space-between;
//           gap: 10px;
//         }
//         .sd-stat-card__value { margin: 0; font-size: 22px; font-weight: 700; letter-spacing: -0.02em; }
//         .sd-stat-card__delta {
//           display: inline-flex;
//           align-items: center;
//           gap: 2px;
//           font-size: 12px;
//           font-weight: 600;
//           margin-top: 4px;
//         }
//         .sd-stat-card__delta--up { color: var(--sd-green); }
//         .sd-stat-card__delta--down { color: var(--sd-rose); }
//         .sd-stat-card__compare { margin: 2px 0 0; font-size: 11px; color: var(--sd-text-faint); }
//         .sd-sparkline { width: 76px; height: 40px; flex-shrink: 0; }
//         .sd-sparkline--up polyline { stroke: var(--sd-green); }
//         .sd-sparkline--down polyline { stroke: var(--sd-rose); }

//         /* Panels */
//         .sd-grid-2col {
//           display: grid;
//           grid-template-columns: 1.6fr 1fr;
//           gap: 18px;
//           align-items: stretch;
//         }
//         .sd-grid-2col-even {
//           display: grid;
//           grid-template-columns: 1.4fr 1fr;
//           gap: 18px;
//         }
//         .sd-panel {
//           background: var(--sd-surface);
//           border: 1px solid var(--sd-border);
//           border-radius: var(--sd-radius-lg);
//           padding: 18px;
//           display: flex;
//           flex-direction: column;
//         }
//         .sd-panel__header {
//           display: flex;
//           align-items: center;
//           justify-content: space-between;
//           margin-bottom: 14px;
//         }
//         .sd-panel__title { margin: 0; font-size: 15px; font-weight: 700; }
//         .sd-link-button {
//           display: inline-flex;
//           align-items: center;
//           gap: 4px;
//           background: none;
//           border: none;
//           color: var(--sd-violet);
//           font-size: 12.5px;
//           font-weight: 600;
//           cursor: pointer;
//         }
//         .sd-sales-panel__controls { display: flex; align-items: center; gap: 6px; }
//         .sd-sales-panel__chart { height: 260px; }
//         .sd-chart-tooltip {
//           background: var(--sd-text);
//           color: #fff;
//           border-radius: 8px;
//           padding: 8px 12px;
//         }
//         .sd-chart-tooltip__label { margin: 0; font-size: 10px; opacity: 0.7; }
//         .sd-chart-tooltip__value { margin: 2px 0 0; font-size: 14px; font-weight: 700; }

//         /* Orders table */
//         .sd-orders-table { width: 100%; border-collapse: collapse; font-size: 13px; }
//         .sd-orders-table th {
//           text-align: left;
//           font-size: 11.5px;
//           text-transform: uppercase;
//           letter-spacing: 0.03em;
//           color: var(--sd-text-faint);
//           font-weight: 600;
//           padding-bottom: 10px;
//           border-bottom: 1px solid var(--sd-border);
//         }
//         .sd-orders-table td {
//           padding: 12px 0;
//           border-bottom: 1px solid var(--sd-border);
//           color: var(--sd-text);
//         }
//         .sd-orders-table__row:last-child td { border-bottom: none; }
//         .sd-orders-table__id { color: var(--sd-text-muted); }
//         .sd-orders-table__product { display: flex; align-items: center; gap: 8px; }
//         .sd-orders-table__swatch {
//           width: 26px; height: 26px; border-radius: 6px;
//           object-fit: cover;
//           flex-shrink: 0;
//         }
//         .sd-status-badge {
//           display: inline-flex;
//           align-items: center;
//           font-size: 11.5px;
//           font-weight: 600;
//           padding: 4px 10px;
//           border-radius: 999px;
//         }
//         .sd-status-delivered { background: var(--sd-green-tint); color: var(--sd-green); }
//         .sd-status-pending { background: var(--sd-amber-tint); color: var(--sd-amber); }
//         .sd-status-shipped { background: var(--sd-blue-tint); color: var(--sd-blue); }
//         .sd-status-cancelled { background: var(--sd-rose-tint); color: var(--sd-rose); }

//         /* Top products */
//         .sd-products-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 14px; }
//         .sd-products-list__item { display: flex; align-items: center; gap: 10px; }
//         .sd-products-list__rank {
//           font-size: 12px; color: var(--sd-text-faint); font-weight: 600; width: 12px;
//         }
//         .sd-products-list__thumb {
//           width: 34px; height: 34px; border-radius: 8px;
//           object-fit: cover;
//           flex-shrink: 0;
//         }
//         .sd-products-list__info { flex: 1; min-width: 0; }
//         .sd-products-list__name { display: block; font-size: 13px; font-weight: 500; margin-bottom: 6px; }
//         .sd-products-list__bar-track {
//           height: 5px; border-radius: 999px; background: var(--sd-bg); overflow: hidden;
//         }
//         .sd-products-list__bar-fill { height: 100%; border-radius: 999px; background: var(--sd-violet); }
//         .sd-products-list__sales { font-size: 12px; color: var(--sd-text-muted); white-space: nowrap; }

//         /* Quick actions */
//         .sd-actions-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 10px; }
//         .sd-actions-list__item {
//           width: 100%;
//           display: flex;
//           align-items: center;
//           gap: 12px;
//           background: var(--sd-bg);
//           border: 1px solid transparent;
//           border-radius: var(--sd-radius-md);
//           padding: 10px 12px;
//           cursor: pointer;
//           text-align: left;
//           transition: border-color 0.15s ease, background 0.15s ease;
//         }
//         .sd-actions-list__item:hover {
//           border-color: var(--sd-border);
//           background: var(--sd-surface);
//         }
//         .sd-actions-list__icon {
//           display: inline-flex; align-items: center; justify-content: center;
//           width: 36px; height: 36px; border-radius: 10px; color: #fff; flex-shrink: 0;
//         }
//         .sd-qa-violet { background: var(--sd-violet); }
//         .sd-qa-green { background: var(--sd-green); }
//         .sd-qa-amber { background: var(--sd-amber); }
//         .sd-qa-blue { background: var(--sd-blue); }
//         .sd-actions-list__text { flex: 1; min-width: 0; display: flex; flex-direction: column; }
//         .sd-actions-list__label { font-size: 13px; font-weight: 600; }
//         .sd-actions-list__helper { font-size: 11.5px; color: var(--sd-text-muted); }
//         .sd-actions-list__arrow { color: var(--sd-text-faint); flex-shrink: 0; }

//         /* Responsive */
//         @media (max-width: 1180px) {
//           .sd-overview__grid { grid-template-columns: repeat(2, 1fr); }
//           .sd-grid-2col, .sd-grid-2col-even { grid-template-columns: 1fr; }
//         }
//         @media (max-width: 640px) {
//           .sd-dashboard__inner { padding: 16px; }
//           .sd-overview__grid { grid-template-columns: 1fr; }
//           .sd-search { width: 100%; order: 3; }
//           .sd-header__actions { width: 100%; }
//         }
//       `}</style>
//     </div>
//   );
// }