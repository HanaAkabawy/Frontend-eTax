import React, { useEffect, useState } from "react";
import "./AdminDashboard.css";
import {
  getUsersThisMonth,
  getPostsToday,
  getRevenueBySubscription,
} from "./../../Services/adminDashboardApi";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const AdminDashboard = () => {
  const [usersThisMonth, setUsersThisMonth] = useState(0);
  const [postsToday, setPostsToday] = useState(0);
  const [revenueData, setRevenueData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("analytics");

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const usersData = await getUsersThisMonth();
        setUsersThisMonth(usersData.users_this_month);

        const postsData = await getPostsToday();
        setPostsToday(postsData.posts_today);

        const revenueRes = await getRevenueBySubscription();
        setRevenueData(revenueRes.data || []);
      } catch (error) {
        console.error("Failed to load analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) return <div className="dashboard-loading">📊 Loading analytics...</div>;

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">📊 Admin Dashboard</h2>

      <div className="dashboard-card-wrapper">
        {/* Tabs Header */}
        <div className="tabs-header">
          <button
            className={`tab-btn ${activeTab === "analytics" ? "active" : ""}`}
            onClick={() => setActiveTab("analytics")}
          >
            Analytics
          </button>
          <button
            className={`tab-btn ${activeTab === "charts" ? "active" : ""}`}
            onClick={() => setActiveTab("charts")}
          >
            Charts
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === "analytics" && (
            <div className="dashboard-cards">
              <div className="dashboard-card">
                <div className="emoji">🧑‍💼</div>
                <p className="card-title">Users This Month</p>
                <p className="card-value">{usersThisMonth}</p>
              </div>
              <div className="dashboard-card">
                <div className="emoji">📝</div>
                <p className="card-title">Posts Today</p>
                <p className="card-value">{postsToday}</p>
              </div>
            </div>
          )}

          {activeTab === "charts" && (
            <div className="dashboard-charts">
              <div className="chart-card">
                <h3>👥 Users by Subscription Plan</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="plan" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="users" fill="#0088FE" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="chart-card">
                <h3>💰 Revenue by Subscription Plan</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={revenueData}
                      dataKey="revenue"
                      nameKey="plan"
                      cx="50%"
                      cy="50%"
                      outerRadius={120}
                      fill="#8884d8"
                      label
                    >
                      {revenueData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
