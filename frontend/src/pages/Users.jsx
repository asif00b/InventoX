import { useEffect, useState, useRef, useMemo } from "react";
import api from "../api/axios";
import UserForm from "./UserForm";
import { MoreVertical } from "lucide-react";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [filterRole, setFilterRole] = useState("ALL");
  const [filterDept, setFilterDept] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [confirmId, setConfirmId] = useState(null);
  const [editUser, setEditUser] = useState(null);

  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");

  const [openMenu, setOpenMenu] = useState(null);
  const dropdownRef = useRef(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const load = async () => {
    try {
      const res = await api.get("/users");
      setUsers(res.data);
    } catch (error) {
      console.error("Failed to load users:", error);
      // Optionally: Add user-facing error message
    }
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenMenu(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const updateMenuPosition = () => {
      if (openMenu?.button) {
        const rect = openMenu.button.getBoundingClientRect();
        const menuHeight = 120; // Approximate menu height
        const spaceBelow = window.innerHeight - rect.bottom;
        const flip = spaceBelow < menuHeight;
        setOpenMenu((prev) => ({
          ...prev,
          top: flip ? rect.top - menuHeight : rect.bottom,
          left: rect.right - 150,
          flipped: flip,
        }));
      }
    };

    window.addEventListener("resize", updateMenuPosition);
    window.addEventListener("scroll", updateMenuPosition);

    return () => {
      window.removeEventListener("resize", updateMenuPosition);
      window.removeEventListener("scroll", updateMenuPosition);
    };
  }, [openMenu]);

  const filteredUsers = useMemo(() => {
    return users.filter(
      (u) =>
        (filterRole === "ALL" || u.role === filterRole) &&
        (filterDept === "ALL" || u.department === filterDept) &&
        ((u.name && u.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
         (u.username && u.username.toLowerCase().includes(searchQuery.toLowerCase())))
    );
  }, [users, filterRole, filterDept, searchQuery]);

  const sortedUsers = useMemo(() => {
    return [...filteredUsers].sort((a, b) => {
      if (!sortField) return 0;

      let valA = a[sortField];
      let valB = b[sortField];

      if (sortField === "createdAt" || sortField === "updatedAt") {
        valA = new Date(valA).getTime() || 0;
        valB = new Date(valB).getTime() || 0;
      }

      if (valA === undefined || valA === null) return 1;
      if (valB === undefined || valB === null) return -1;

      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredUsers, sortField, sortOrder]);

  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return sortedUsers.slice(start, end);
  }, [sortedUsers, currentPage, pageSize]);

  const totalPages = Math.ceil(sortedUsers.length / pageSize);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6 p-4 relative">
      <h2 className="text-xl font-semibold">Create User</h2>
      <UserForm onCreated={load} />

      <h2 className="text-xl font-semibold">Users List</h2>

      {/* Filters and Search */}
      <div className="flex flex-wrap gap-3 items-center">
        <input
          type="text"
          placeholder="Search by name or username..."
          className="border p-2 rounded flex-1 max-w-md"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
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

      {/* Page Size Selector */}
      <div className="flex items-center gap-2">
        <label>Show:</label>
        <select
          className="border p-2 rounded"
          value={pageSize}
          onChange={handlePageSizeChange}
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
        </select>
        <span>per page</span>
      </div>

      {/* Table */}
      <div className="bg-white shadow rounded-xl overflow-x-auto">
        <table className="w-full">
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
                className="p-3 cursor-pointer"
              >
                Role{" "}
                {sortField === "role" && (sortOrder === "asc" ? "▲" : "▼")}
              </th>

              <th className="p-3 hidden md:table-cell">Designation</th>
              <th className="p-3 hidden md:table-cell">Department</th>

              <th
                onClick={() => handleSort("createdAt")}
                className="p-3 hidden lg:table-cell cursor-pointer"
              >
                Created{" "}
                {sortField === "createdAt" &&
                  (sortOrder === "asc" ? "▲" : "▼")}
              </th>

              <th
                onClick={() => handleSort("updatedAt")}
                className="p-3 hidden lg:table-cell cursor-pointer"
              >
                Modified{" "}
                {sortField === "updatedAt" &&
                  (sortOrder === "asc" ? "▲" : "▼")}
              </th>

              <th className="p-3">Status</th>
              <th className="p-3 text-right pr-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {paginatedUsers.map((u) => (
              <tr key={u._id} className="border-t hover:bg-slate-50">
                <td className="p-3 flex items-center gap-3">
                  <img
                    src={u.photo || "https://i.pravatar.cc/40"}
                    className="w-9 h-9 rounded-full"
                    alt={`${u.name || u.username}'s photo`}
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

                <td className="p-3">{u.role}</td>

                <td className="p-3 hidden md:table-cell">
                  {u.designation}
                </td>

                <td className="p-3 hidden md:table-cell">
                  {u.department}
                </td>

                <td className="p-3 hidden lg:table-cell">
                  {u.createdAt &&
                    new Date(u.createdAt).toLocaleDateString()}
                </td>

                <td className="p-3 hidden lg:table-cell">
                  {u.updatedAt &&
                    new Date(u.updatedAt).toLocaleDateString()}
                </td>

                <td className="p-3">{u.isActive ? "Active" : "Disabled"}</td>

                <td className="p-3 text-right pr-3 relative">
                  <button
                    onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const menuHeight = 120; // Approximate menu height
                      const spaceBelow = window.innerHeight - rect.bottom;
                      const flip = spaceBelow < menuHeight;
                      setOpenMenu({
                        id: u._id,
                        top: flip ? rect.top - menuHeight : rect.bottom,
                        left: rect.right - 150,
                        button: e.currentTarget,
                        flipped: flip,
                      });
                    }}
                    className="p-2 hover:bg-slate-100 rounded"
                    aria-label={`Actions for user ${u.username}`}
                  >
                    <MoreVertical size={18} />
                  </button>
                  {openMenu?.id === u._id && (
                    <div
                      ref={dropdownRef}
                      className="fixed w-36 bg-white shadow-lg rounded-lg border z-50"
                      style={{
                        top: openMenu.top,
                        left: openMenu.left,
                      }}
                    >
                      <button
                        onClick={() => {
                          setEditUser(u);
                          setOpenMenu(null);
                        }}
                        className="block w-full text-left px-4 py-2 hover:bg-slate-100"
                      >
                        Edit
                      </button>

                      {u.isActive ? (
                        <button
                          onClick={async () => {
                            try {
                              await api.patch(`/users/${u._id}/disable`);
                              load();
                            } catch (error) {
                              console.error("Failed to disable user:", error);
                            }
                            setOpenMenu(null);
                          }}
                          className="block w-full text-left px-4 py-2 hover:bg-slate-100 text-yellow-600"
                        >
                          Disable
                        </button>
                      ) : (
                        <button
                          onClick={async () => {
                            try {
                              await api.patch(`/users/${u._id}/enable`);
                              load();
                            } catch (error) {
                              console.error("Failed to enable user:", error);
                            }
                            setOpenMenu(null);
                          }}
                          className="block w-full text-left px-4 py-2 hover:bg-slate-100 text-green-600"
                        >
                          Enable
                        </button>
                      )}

                      <button
                        onClick={() => {
                          setConfirmId(u._id);
                          setOpenMenu(null);
                        }}
                        className="block w-full text-left px-4 py-2 hover:bg-slate-100 text-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}

            {paginatedUsers.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  className="p-6 text-center text-gray-500"
                >
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-3 py-1 rounded ${currentPage === page ? "bg-blue-500 text-white" : "bg-gray-200"}`}
            >
              {page}
            </button>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editUser && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-xl w-full max-w-4xl shadow">
            <h3 className="text-lg font-semibold mb-4">
              Edit User
            </h3>
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
            <h3 className="font-semibold text-lg">
              Confirm Delete
            </h3>
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
                  try {
                    await api.delete(`/users/${confirmId}`);
                    load();
                  } catch (error) {
                    console.error("Failed to delete user:", error);
                  }
                  setConfirmId(null);
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