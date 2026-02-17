import { useEffect, useState } from "react";
import api from "../api/axios";
import UserForm from "./UserForm";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [filterRole, setFilterRole] = useState("ALL");
  const [filterDept, setFilterDept] = useState("ALL");
  const [confirmId, setConfirmId] = useState(null);
  const [editUser, setEditUser] = useState(null);

  // ✅ Sorting state
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");

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

  // ✅ Sorting logic
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (!sortField) return 0;

    const valA = a[sortField];
    const valB = b[sortField];

    if (!valA) return 1;
    if (!valB) return -1;

    if (valA < valB) return sortOrder === "asc" ? -1 : 1;
    if (valA > valB) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  // ✅ Sort handler
  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  return (
    <div className="space-y-6 p-4">
      <h2 className="text-xl font-semibold">Create User</h2>
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
        <table className="w-full min-w-[900px]">
          <thead className="bg-slate-200 text-left">
            <tr>
              <th
                onClick={() => handleSort("username")}
                className="p-3 cursor-pointer"
              >
                User{" "}
                {sortField === "username" &&
                  (sortOrder === "asc" ? "▲" : "▼")}
              </th>

              <th
                onClick={() => handleSort("role")}
                className="cursor-pointer"
              >
                Role{" "}
                {sortField === "role" &&
                  (sortOrder === "asc" ? "▲" : "▼")}
              </th>

              <th>Designation</th>
              <th>Department</th>

              <th
                onClick={() => handleSort("createdAt")}
                className="cursor-pointer"
              >
                Created{" "}
                {sortField === "createdAt" &&
                  (sortOrder === "asc" ? "▲" : "▼")}
              </th>

              <th
                onClick={() => handleSort("updatedAt")}
                className="cursor-pointer"
              >
                Modified{" "}
                {sortField === "updatedAt" &&
                  (sortOrder === "asc" ? "▲" : "▼")}
              </th>

              <th>Status</th>
              <th className="text-right pr-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {sortedUsers.map((u) => (
              <tr key={u._id} className="border-t hover:bg-slate-50">
                <td className="p-3 flex items-center gap-3">
                  <img
                    src={u.photo || "https://i.pravatar.cc/40"}
                    className="w-9 h-9 rounded-full"
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

                <td>
                  {u.updatedAt &&
                    new Date(u.updatedAt).toLocaleDateString()}
                </td>

                <td>{u.isActive ? "Active" : "Disabled"}</td>

                <td className="text-right pr-3 space-x-2">
                  <button
                    onClick={() => setEditUser(u)}
                    className="text-blue-600"
                  >
                    Edit
                  </button>

                  {u.isActive ? (
                    <button
                      onClick={() =>
                        api.patch(`/users/${u._id}/disable`).then(load)
                      }
                      className="text-yellow-600"
                    >
                      Disable
                    </button>
                  ) : (
                    <button
                      onClick={() =>
                        api.patch(`/users/${u._id}/enable`).then(load)
                      }
                      className="text-green-600"
                    >
                      Enable
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

            {sortedUsers.length === 0 && (
              <tr>
                <td colSpan={8} className="p-6 text-center text-gray-500">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editUser && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-xl w-full max-w-4xl shadow">
            <h3 className="text-lg font-semibold mb-4">Edit User</h3>
            <UserForm
              initialData={editUser}
              onCreated={load}
              onClose={() => setEditUser(null)}
            />
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {confirmId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-xl w-full max-w-sm space-y-4">
            <h3 className="font-semibold text-lg">Confirm Delete</h3>
            <p>This user will be permanently deleted.</p>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setConfirmId(null)}
                className="border px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await api.delete(`/users/${confirmId}`);
                  setConfirmId(null);
                  load();
                }}
                className="bg-red-600 text-white px-4 py-2 rounded"
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
