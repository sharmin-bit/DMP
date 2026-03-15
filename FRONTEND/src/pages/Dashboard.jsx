import { useNavigate } from "react-router-dom";

export default function Dashboard() {

  const navigate = useNavigate();

  return (
    <div className="flex h-screen bg-gradient-to-br from-indigo-100 via-white to-purple-100">

      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md p-6">

        <h1 className="text-xl font-bold text-indigo-600 mb-8">
          ⚡ Prompt2Deploy
        </h1>

        <nav className="flex flex-col gap-4">

          <button className="text-left px-4 py-2 rounded-lg bg-indigo-600 text-white">
            Dashboard
          </button>

          <button
            onClick={() => navigate("/idea")}
            className="text-left px-4 py-2 rounded-lg hover:bg-gray-100"
          >
            New Project
          </button>

          <button className="text-left px-4 py-2 rounded-lg hover:bg-gray-100">
            Saved Plans
          </button>

          <button className="text-left px-4 py-2 rounded-lg hover:bg-gray-100">
            Cloud Platforms
          </button>

        </nav>

      </div>

      {/* Main Content */}
      <div className="flex-1 p-10 overflow-y-auto">

        {/* Top bar */}
        <div className="flex justify-between items-center mb-8">

          <h2 className="text-2xl font-semibold text-gray-800">
            Dashboard
          </h2>

          <div className="flex gap-4">

            <input
              placeholder="Search projects..."
              className="px-4 py-2 border rounded-lg"
            />

            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg">
              Refresh
            </button>

          </div>

        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-6 mb-8">

          <div className="bg-white p-6 rounded-xl shadow border">
            <p className="text-gray-500 text-sm">Total Projects</p>
            <h3 className="text-2xl font-bold">247</h3>
          </div>

          <div className="bg-white p-6 rounded-xl shadow border">
            <p className="text-gray-500 text-sm">Ideas Today</p>
            <h3 className="text-2xl font-bold">04</h3>
          </div>

          <div className="bg-white p-6 rounded-xl shadow border">
            <p className="text-gray-500 text-sm">Generated Plans</p>
            <h3 className="text-2xl font-bold">189</h3>
          </div>

          <div className="bg-white p-6 rounded-xl shadow border">
            <p className="text-gray-500 text-sm">Active Users</p>
            <h3 className="text-2xl font-bold">156</h3>
          </div>

        </div>

        {/* Stack Trends */}
        <div className="bg-white p-6 rounded-xl shadow border mb-8">

          <h3 className="font-semibold mb-4">
            Tech Stack Trends
          </h3>

          <div className="flex gap-4">

            <span className="px-4 py-2 bg-blue-100 rounded-lg">
              React
            </span>

            <span className="px-4 py-2 bg-green-100 rounded-lg">
              Node.js
            </span>

            <span className="px-4 py-2 bg-yellow-100 rounded-lg">
              JavaScript
            </span>

            <span className="px-4 py-2 bg-orange-100 rounded-lg">
              Firebase
            </span>

            <span className="px-4 py-2 bg-purple-100 rounded-lg">
              Python
            </span>

          </div>

        </div>

        {/* Projects Table */}
        <div className="bg-white p-6 rounded-xl shadow border">

          <h3 className="font-semibold mb-4">
            Recent Ideas
          </h3>

          <table className="w-full text-left">

            <thead className="text-gray-500 text-sm">
              <tr>
                <th className="py-2">ID</th>
                <th>User</th>
                <th>Idea</th>
                <th>Date</th>
                <th></th>
              </tr>
            </thead>

            <tbody>

              <tr className="border-t">
                <td className="py-3">#1247</td>
                <td>John</td>
                <td>E-commerce app with React</td>
                <td>Dec 15</td>
                <td>
                  <button
                    onClick={() => navigate("/plan")}
                    className="text-indigo-600"
                  >
                    View
                  </button>
                </td>
              </tr>

              <tr className="border-t">
                <td className="py-3">#1246</td>
                <td>Sarah</td>
                <td>Task manager with Firebase</td>
                <td>Dec 14</td>
                <td>
                  <button
                    onClick={() => navigate("/plan")}
                    className="text-indigo-600"
                  >
                    View
                  </button>
                </td>
              </tr>

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}