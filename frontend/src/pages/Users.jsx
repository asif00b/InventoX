import { useEffect, useState } from "react";
import api from "../api/axios";
import UserForm from "./UserForm";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [filterRole, setFilterRole] = useState("ALL");
  const [filterDept, setFilterDept] = useState("ALL");
  const [confirmId, setConfirmId] = useState(null);

  const load = async () => {
    const res = await api.get("/users");
    setUsers(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  const filteredUsers = users.filter(
    (u) =>
      (filterRole === "ALL" || u.role === filterRole) &&
      (filterDept === "ALL" || u.department === filterDept)
  );

  return (
    <div className="space-y-6 p-4">
      <h2 className="text-xl font-semibold">Create User</h2>

      {/* User Creation Form */}
      <UserForm onCreated={load} />

      <h2 className="text-xl font-semibold">Users List</h2>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <select
          className="border p-2 rounded"
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
        >
          <option value="ALL">All Roles</option>
          <option value="ADMIN">ADMIN</option>
          <option value="STAFF">STAFF</option>
          <option value="VIEWER">VIEWER</option>
        </select>

        <select
          className="border p-2 rounded"
          value={filterDept}
          onChange={(e) => setFilterDept(e.target.value)}
        >
          <option value="ALL">All Departments</option>
          {[...new Set(users.map((u) => u.department).filter(Boolean))]
            .sort()
            .map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white shadow rounded-xl overflow-x-auto">
        <table className="w-full min-w-[700px] border-collapse">
          <thead className="bg-slate-200 text-left">
            <tr>
              <th className="p-3">User</th>
              <th>Role</th>
              <th>Designation</th>
              <th>Department</th>
              <th>Created</th>
              <th>Status</th>
              <th className="text-right pr-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.map((u) => (
              <tr key={u._id} className="border-t hover:bg-slate-50">
                <td className="p-3 flex items-center gap-3">
                  <img
                    src={u.photo || "https://i.pravatar.cc/40"}
                    alt="avatar"
                    className="w-9 h-9 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-medium">
                      {u.name || u.username}
                    </div>
                    <div className="text-xs text-gray-500">
                      {u.username}
                    </div>
                  </div>
                </td>

                <td>{u.role}</td>
                <td>{u.designation}</td>
                <td>{u.department}</td>

                <td>
                  {u.createdAt &&
                    new Date(u.createdAt).toLocaleDateString()}
                </td>

                <td>{u.isActive ? "Active" : "Disabled"}</td>

                <td className="text-right pr-3 space-x-2 whitespace-nowrap">
                  {!u.isActive && (
                    <button
                      onClick={() =>
                        api.patch(`/users/${u._id}/enable`).then(load)
                      }
                      className="text-green-600"
                    >
                      Enable
                    </button>
                  )}

                  {u.isActive && (
                    <button
                      onClick={() =>
                        api.patch(`/users/${u._id}/disable`).then(load)
                      }
                      className="text-yellow-600"
                    >
                      Disable
                    </button>
                  )}

                  <button
                    onClick={() => setConfirmId(u._id)}
                    className="text-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan={7} className="p-6 text-center text-gray-500">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Confirm Delete */}
      {confirmId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-xl w-full max-w-sm space-y-4 shadow">
            <h3 className="font-semibold text-lg">Confirm Delete</h3>
            <p>This user will be permanently deleted.</p>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setConfirmId(null)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>

              <button
                onClick={async () => {
                  await api.delete(`/users/${confirmId}`);
                  setConfirmId(null);
                  load();
                }}
                className="px-4 py-2 bg-red-600 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
