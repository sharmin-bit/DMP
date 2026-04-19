import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [techStacks, setTechStacks] = useState([]);
  const [plans, setPlans] = useState([]); // ✅ NEW
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("dashboard");

  const token = localStorage.getItem("accessToken");
  const isAdmin = localStorage.getItem("isAdmin");

  useEffect(() => {
    if (!token) {
      window.location.href = "/login";
      return;
    }

    if (isAdmin !== "true") {
      alert("Access denied!");
      window.location.href = "/dashboard";
      return;
    }

    fetchData();
  }, []);

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const fetchData = async () => {
    try {
      const [usersRes, techRes, plansRes] = await Promise.all([
        axios.get("http://127.0.0.1:8000/api/myapp/users/", config),
        axios.get("http://127.0.0.1:8000/api/myapp/techstacks/", config),
        axios.get("http://127.0.0.1:8000/api/myapp/plans/", config), // ✅ NEW
      ]);

      setUsers(usersRes.data);
      setTechStacks(techRes.data);
      setPlans(plansRes.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load data");
    }
  };

  // Rankings
  const getTopStacks = () => {
    const count = {};
    techStacks.forEach((item) => {
      (item.data.frameworks || []).forEach((fw) => {
        count[fw] = (count[fw] || 0) + 1;
      });
    });
    return Object.entries(count).sort((a, b) => b[1] - a[1]).slice(0, 4);
  };

  const getTopClouds = () => {
    const count = {};
    techStacks.forEach((item) => {
      (item.data.cloud || []).forEach((cloud) => {
        count[cloud] = (count[cloud] || 0) + 1;
      });
    });
    return Object.entries(count).sort((a, b) => b[1] - a[1]).slice(0, 4);
  };

  const getRecentUsers = () => users.slice(0, 6);

  return (
    <div className="flex h-screen bg-[#0B1120] text-white">

      {/* Sidebar */}
      <div className="w-64 bg-[#020617] border-r border-gray-800 flex flex-col">
        <h1 className="text-2xl font-bold p-6 bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
          Prompt2Deploy
        </h1>

        <nav className="flex-1 px-4 space-y-4 text-gray-400">
          <p onClick={() => setActiveTab("dashboard")} className={activeTab==="dashboard"?"text-purple-400":"hover:text-purple-400 cursor-pointer"}>Dashboard</p>
          <p onClick={() => setActiveTab("users")} className={activeTab==="users"?"text-purple-400":"hover:text-purple-400 cursor-pointer"}>Users</p>
          <p onClick={() => setActiveTab("plans")} className={activeTab==="plans"?"text-purple-400":"hover:text-purple-400 cursor-pointer"}>Plans</p>
        </nav>

        <div
          className="p-4 border-t border-gray-800 cursor-pointer"
          onClick={() => {
            localStorage.clear();
            window.location.href = "/login";
          }}
        >
          Logout
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 p-6 overflow-auto">

        {error && <div className="bg-red-500 p-3 rounded mb-4">{error}</div>}

        {/* ================= DASHBOARD ================= */}
        {activeTab === "dashboard" && (
          <>
            <h2 className="text-3xl mb-6 text-purple-400">Admin Dashboard</h2>

            {/* Cards */}
            <div className="grid grid-cols-3 gap-6 mb-8">
              <Card title="Total Users" value={users.length} color="purple" />
              <Card title="Active Plans" value={plans.length} color="blue" />
              <Card title="Deploy Requests" value={techStacks.length} color="pink" />
            </div>

            {/* Top sections */}
            <div className="grid grid-cols-2 gap-6 mb-8">
              <Box title="Top Tech Stacks" color="purple" data={getTopStacks()} />
              <Box title="Top Cloud Providers" color="blue" data={getTopClouds()} />
            </div>

            {/* Recent users */}
            <UsersTable users={getRecentUsers()} title="Recent Users" />
          </>
        )}

        {/* ================= USERS ================= */}
        {activeTab === "users" && (
          <UsersTable users={users} title="All Users" />
        )}

        {/* ================= PLANS ================= */}
        {activeTab === "plans" && (
          <>
            <h2 className="text-3xl mb-6 text-pink-400">Deployment Plans</h2>

            <div className="bg-[#020617] rounded-2xl border border-gray-800 p-4">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-gray-500 border-b border-gray-800">
                    <th className="p-2">ID</th>
                    <th className="p-2">User</th>
                    <th className="p-2">Project Idea</th>
                    <th className="p-2">Created</th>
                  </tr>
                </thead>

                <tbody>
                  {plans.map((plan) => (
                    <tr key={plan.id} className="border-b border-gray-800">
                      <td className="p-2">{plan.id}</td>
                      <td className="p-2">{plan.username}</td>
                      <td className="p-2">{plan.prompt}</td>
                      <td className="p-2">
                        {new Date(plan.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

      </div>
    </div>
  );
}

/* ================= REUSABLE COMPONENTS ================= */

const Card = ({ title, value, color }) => (
  <div className="bg-[#020617] p-4 rounded-2xl border border-gray-800">
    <h3 className="text-gray-400">{title}</h3>
    <p className={`text-2xl font-bold text-${color}-400`}>{value}</p>
  </div>
);

const Box = ({ title, data, color }) => (
  <div className="bg-[#020617] p-5 rounded-2xl border border-gray-800">
    <h3 className={`text-xl mb-4 text-${color}-400`}>{title}</h3>
    <ul>
      {data.map(([name], i) => (
        <li key={i} className="flex justify-between">
          <span>{name}</span>
          <span>#{i + 1}</span>
        </li>
      ))}
    </ul>
  </div>
);

const UsersTable = ({ users, title }) => (
  <>
    <h3 className="text-xl mb-4 text-blue-400">{title}</h3>
    <div className="bg-[#020617] rounded-2xl border border-gray-800 p-4">
      <table className="w-full text-left">
        <thead>
          <tr className="text-gray-500 border-b border-gray-800">
            <th className="p-2">ID</th>
            <th className="p-2">Username</th>
            <th className="p-2">Email</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} className="border-b border-gray-800">
              <td className="p-2">{u.id}</td>
              <td className="p-2">{u.username}</td>
              <td className="p-2">{u.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </>
);