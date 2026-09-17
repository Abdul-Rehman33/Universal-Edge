import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Logo from "../../assets/Logo.png";
import "./AdminDashboard.css";

// ─────────────────────────────────────────────────────────────
//  SIDEBAR NAV ITEMS
// ─────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  {
    label: "Dashboard",
    href:  "/admin",
    active: true,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8"
        strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7"/>
        <rect x="14" y="3" width="7" height="7"/>
        <rect x="3" y="14" width="7" height="7"/>
        <rect x="14" y="14" width="7" height="7"/>
      </svg>
    ),
  },
  {
    label: "Products",
    href:  "/admin/products",
    soon:  false,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8"
        strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
        <line x1="3" y1="6" x2="21" y2="6"/>
        <path d="M16 10a4 4 0 01-8 0"/>
      </svg>
    ),
  },
  {
    label: "Orders",
    href:  "/admin/orders",
    soon:  false,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8"
        strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
      </svg>
    ),
  },
  {
    label: "Customers",
    href:  "/admin/users",
    soon:  false,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8"
        strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 00-3-3.87"/>
        <path d="M16 3.13a4 4 0 010 7.75"/>
      </svg>
    ),
  },
  {
    label: "Categories",
    href:  "/admin/categories",
    soon:  true,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8"
        strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 6h16M4 10h16M4 14h16M4 18h16"/>
      </svg>
    ),
  },
  {
    label: "Reviews",
    href:  "/admin/reviews",
    soon:  true,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8"
        strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
      </svg>
    ),
  },
  {
    label: "Sales / Reports",
    href:  "/admin/reports",
    soon:  true,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8"
        strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10"/>
        <line x1="12" y1="20" x2="12" y2="4"/>
        <line x1="6"  y1="20" x2="6"  y2="14"/>
      </svg>
    ),
  },
  {
    label: "Settings",
    href:  "/admin/settings",
    soon:  true,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8"
        strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3"/>
        <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
      </svg>
    ),
  },
];

// ─────────────────────────────────────────────────────────────
//  DUMMY DATA — replace with real API data later
// ─────────────────────────────────────────────────────────────
const DUMMY_STATS = {
  totalProducts:  24,
  totalOrders:    156,
  pendingOrders:  12,
  deliveredOrders:98,
  totalCustomers: 84,
  totalRevenue:   1248500,
  lowStockCount:  5,
};

const DUMMY_ORDERS = [
  { id: "UE-A3F8K2", customer: "Abdul Rehman",  date: "Sep 10, 2026", amount: 12500,  payment: "COD",       status: "pending"    },
  { id: "UE-B7C2M9", customer: "Sara Ahmed",    date: "Sep 09, 2026", amount: 8900,   payment: "JazzCash",  status: "delivered"  },
  { id: "UE-D1K5P3", customer: "Usman Raza",    date: "Sep 09, 2026", amount: 25600,  payment: "EasyPaisa", status: "shipped"    },
  { id: "UE-E4N8Q1", customer: "Fatima Ali",    date: "Sep 08, 2026", amount: 6200,   payment: "COD",       status: "processing" },
  { id: "UE-F9R2T7", customer: "Hassan Khan",   date: "Sep 08, 2026", amount: 15800,  payment: "COD",       status: "cancelled"  },
];

const DUMMY_LOW_STOCK = [
  { id: 1, name: "Nike Air Max 270",  category: "Shoes",       stock: 3,  image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&q=80" },
  { id: 2, name: "Dior Sauvage EDP",  category: "Perfumes",    stock: 2,  image: "https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=100&q=80" },
  { id: 3, name: "Casio G-Shock",     category: "Accessories", stock: 0,  image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&q=80" },
  { id: 4, name: "Classic White Tee", category: "Clothing",    stock: 4,  image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100&q=80" },
];

const DUMMY_SALES = {
  today: { amount: 48500,  orders: 4  },
  week:  { amount: 284000, orders: 23 },
  month: { amount: 896500, orders: 78 },
};

// Format price
const fmt = (n) => `PKR ${n.toLocaleString()}`;

// Today's date
const todayDate = new Date().toLocaleDateString("en-US", {
  weekday: "long", year: "numeric", month: "long", day: "numeric",
});

// ─────────────────────────────────────────────────────────────
//  STATUS BADGE
// ─────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  return (
    <span className={`status-badge ${status}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────
//  ADMIN DASHBOARD COMPONENT
// ─────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats,       setStats]       = useState(DUMMY_STATS);
  const [orders,      setOrders]      = useState(DUMMY_ORDERS);
  const [lowStock,    setLowStock]    = useState(DUMMY_LOW_STOCK);
  const [sales,       setSales]       = useState(DUMMY_SALES);
  const [loading,     setLoading]     = useState(false);

  // Get admin info from localStorage
  const adminUser = JSON.parse(localStorage.getItem("user") || "{}");

  // Get initials for avatar
  const getInitials = () => {
    const first = adminUser.firstName?.[0] || "A";
    const last  = adminUser.lastName?.[0]  || "";
    return (first + last).toUpperCase();
  };

  // Fetch real data from backend
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await axios.get("http://localhost:5000/api/admin/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.success) {
          const { stats: s, recentOrders, recentUsers } = res.data;

          setStats({
            totalProducts:   s.totalProducts,
            totalOrders:     s.totalOrders,
            pendingOrders:   s.ordersByStatus.pending,
            deliveredOrders: s.ordersByStatus.delivered,
            totalCustomers:  s.totalUsers,
            totalRevenue:    s.totalRevenue,
            lowStockCount:   DUMMY_STATS.lowStockCount,
          });

          // Map recent orders from backend
          if (recentOrders?.length > 0) {
            setOrders(
              recentOrders.map((o) => ({
                id:       o.orderId,
                customer: o.user ? `${o.user.firstName} ${o.user.lastName}` : "Guest",
                date:     new Date(o.createdAt).toLocaleDateString("en-US", {
                  month: "short", day: "numeric", year: "numeric",
                }),
                amount:  o.totalPrice,
                payment: o.paymentMethod,
                status:  o.status,
              }))
            );
          }
        }
      } catch (err) {
        // API fail → dummy data use karo
        console.log("Using dummy data");
      }
    };

    fetchDashboard();
  }, []);

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="admin-layout">

      {/* ── SIDEBAR OVERLAY (mobile) ── */}
      {sidebarOpen && (
        <div
          className="admin-sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ══ SIDEBAR ══ */}
      <aside className={`admin-sidebar ${sidebarOpen ? "open" : ""}`}>

        {/* Logo */}
        <Link to="/" className="sidebar-logo">
          <img src={Logo} alt="Universal Edge" className="sidebar-logo-img" />
          <div>
            <span className="sidebar-logo-name">
              Universal <span>Edge</span>
            </span>
            <span className="sidebar-logo-badge">Admin Panel</span>
          </div>
        </Link>

        {/* Nav */}
        <span className="sidebar-section-label">Main Menu</span>
        <nav className="sidebar-nav">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              className={`sidebar-nav-item ${item.active ? "active" : ""}`}
              onClick={() => setSidebarOpen(false)}
            >
              {item.icon}
              {item.label}
              {item.soon && <span className="sidebar-soon">Soon</span>}
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <div className="sidebar-footer">
          <button className="sidebar-logout-btn" onClick={handleLogout}>
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8"
              strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Logout
          </button>
        </div>

      </aside>

      {/* ══ MAIN CONTENT ══ */}
      <main className="admin-main">

        {/* ── Header ── */}
        <header className="admin-header">

          {/* Mobile hamburger */}
          <button
            className="admin-hamburger"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <span /><span /><span />
          </button>

          <h1 className="admin-header-title">
            Dashboard
            <span>Overview</span>
          </h1>

          {/* Notification */}
          <button className="admin-notif-btn" aria-label="Notifications">
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8"
              strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 01-3.46 0"/>
            </svg>
            <span className="admin-notif-dot" />
          </button>

          {/* Profile */}
          <div className="admin-profile">
            <div className="admin-avatar">{getInitials()}</div>
            <div className="admin-profile-info">
              <span className="admin-profile-name">
                {adminUser.firstName || "Admin"}
              </span>
              <span className="admin-profile-role">Administrator</span>
            </div>
          </div>

        </header>

        {/* ── Body ── */}
        <div className="admin-body">

          {/* Page heading */}
          <div className="admin-page-heading">
            <h2 className="admin-page-title">Good morning, {adminUser.firstName || "Admin"} 👋</h2>
            <span className="admin-page-date">{todayDate}</span>
          </div>

          {/* ── Stats Cards ── */}
          <div className="stats-grid">

            <div className="stat-card gold">
              <div className="stat-icon">💰</div>
              <div className="stat-info">
                <span className="stat-value">{fmt(stats.totalRevenue)}</span>
                <span className="stat-label">Total Revenue</span>
                <span className="stat-change up">↑ From delivered orders</span>
              </div>
            </div>

            <div className="stat-card green">
              <div className="stat-icon">📦</div>
              <div className="stat-info">
                <span className="stat-value">{stats.totalOrders}</span>
                <span className="stat-label">Total Orders</span>
                <span className="stat-change up">↑ All time</span>
              </div>
            </div>

            <div className="stat-card orange">
              <div className="stat-icon">⏳</div>
              <div className="stat-info">
                <span className="stat-value">{stats.pendingOrders}</span>
                <span className="stat-label">Pending Orders</span>
                <span className="stat-change down">Needs attention</span>
              </div>
            </div>

            <div className="stat-card blue">
              <div className="stat-icon">✅</div>
              <div className="stat-info">
                <span className="stat-value">{stats.deliveredOrders}</span>
                <span className="stat-label">Delivered Orders</span>
                <span className="stat-change up">↑ Completed</span>
              </div>
            </div>

            <div className="stat-card purple">
              <div className="stat-icon">👥</div>
              <div className="stat-info">
                <span className="stat-value">{stats.totalCustomers}</span>
                <span className="stat-label">Total Customers</span>
                <span className="stat-change up">↑ Registered users</span>
              </div>
            </div>

            <div className="stat-card green">
              <div className="stat-icon">🛍️</div>
              <div className="stat-info">
                <span className="stat-value">{stats.totalProducts}</span>
                <span className="stat-label">Total Products</span>
                <span className="stat-change up">↑ In catalogue</span>
              </div>
            </div>

            <div className="stat-card red">
              <div className="stat-icon">⚠️</div>
              <div className="stat-info">
                <span className="stat-value">{stats.lowStockCount}</span>
                <span className="stat-label">Low Stock Items</span>
                <span className="stat-change down">Needs restocking</span>
              </div>
            </div>

          </div>

          {/* ── Sales Overview ── */}
          <div className="admin-card">
            <div className="admin-card-header">
              <span className="admin-card-title">Sales Overview</span>
              <a href="#" className="admin-card-link">View Reports →</a>
            </div>
            <div className="sales-grid">
              <div className="sales-item">
                <span className="sales-period">Today</span>
                <span className="sales-amount">{fmt(sales.today.amount)}</span>
                <span className="sales-orders">{sales.today.orders} orders</span>
              </div>
              <div className="sales-item">
                <span className="sales-period">This Week</span>
                <span className="sales-amount">{fmt(sales.week.amount)}</span>
                <span className="sales-orders">{sales.week.orders} orders</span>
              </div>
              <div className="sales-item">
                <span className="sales-period">This Month</span>
                <span className="sales-amount">{fmt(sales.month.amount)}</span>
                <span className="sales-orders">{sales.month.orders} orders</span>
              </div>
            </div>
          </div>

          {/* ── Two Column Row ── */}
          <div className="admin-row">

            {/* Recent Orders */}
            <div className="admin-card">
              <div className="admin-card-header">
                <span className="admin-card-title">Recent Orders</span>
                <Link to="/admin/orders" className="admin-card-link">
                  View All →
                </Link>
              </div>
              <div className="orders-table-wrap">
                <table className="orders-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Date</th>
                      <th>Amount</th>
                      <th>Payment</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id}>
                        <td><span className="order-id">{order.id}</span></td>
                        <td><span className="order-customer">{order.customer}</span></td>
                        <td>{order.date}</td>
                        <td><span className="order-amount">{fmt(order.amount)}</span></td>
                        <td>{order.payment}</td>
                        <td><StatusBadge status={order.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Low Stock */}
            <div className="admin-card">
              <div className="admin-card-header">
                <span className="admin-card-title">Low Stock Alert</span>
                <Link to="/admin/products" className="admin-card-link">
                  Manage →
                </Link>
              </div>
              <div className="stock-list">
                {lowStock.map((item) => (
                  <div className="stock-item" key={item.id}>
                    <img
                      className="stock-item-img"
                      src={item.image}
                      alt={item.name}
                      loading="lazy"
                    />
                    <div className="stock-item-info">
                      <p className="stock-item-name">{item.name}</p>
                      <p className="stock-item-cat">{item.category}</p>
                    </div>
                    <span
                      className={`stock-badge ${
                        item.stock === 0 ? "out" :
                        item.stock <= 2  ? "critical" : "low"
                      }`}
                    >
                      {item.stock === 0 ? "Out of Stock" :
                       item.stock <= 2  ? `Critical (${item.stock})` :
                       `Low (${item.stock})`}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}