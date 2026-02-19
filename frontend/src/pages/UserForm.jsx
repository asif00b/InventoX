// src/pages/UserForm.jsx
import { useState, useRef } from "react";
import api from "../api/axios";

export default function UserForm({
  onCreated,
  initialData = null,
  onClose,
}) {
  const emptyForm = {
    username: "",
    password: "",
    role: "STAFF",
    name: "",
    employeeId: "",
    designation: "",
    department: "",
    phone: "",
    photo: "",
  };

  const [form, setForm] = useState(
    initialData ? { ...initialData, password: "" } : emptyForm
  );

  const [showPass, setShowPass] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const timerRef = useRef(null);

  const togglePassword = () => {
    setShowPass((p) => !p);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setShowPass(false), 10000);
  };

  const handlePhoto = (file) => {
    if (!file) return;

    if (!["image/jpeg", "image/png"].includes(file.type)) {
      setErrorMsg("Only JPG and PNG images allowed");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () =>
      setForm((p) => ({ ...p, photo: reader.result }));
    reader.readAsDataURL(file);
  };

  const submit = async () => {
    setErrorMsg("");
    setSuccessMsg("");

    if (!form.username.trim()) {
      setErrorMsg("Username is required");
      return;
    }

    if (!initialData && !form.password.trim()) {
      setErrorMsg("Password is required");
      return;
    }

    try {
      setLoading(true);

      if (initialData?._id) {
        await api.patch(`/users/${initialData._id}`, form);
        setSuccessMsg("User updated successfully");
      } else {
        await api.post("/users", form);
        setSuccessMsg("User created successfully");
        setForm(emptyForm);
      }

      onCreated?.();

      setTimeout(() => {
        setSuccessMsg("");
        onClose?.();
      }, 1200);

    } catch (error) {
      setErrorMsg(
        error.response?.data?.msg ||
        error.response?.data?.message ||
        "Failed to save user"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-xl p-5 space-y-4">

      {/* Error Message */}
      {errorMsg && (
        <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-2 rounded">
          {errorMsg}
        </div>
      )}

      {/* Success Message */}
      {successMsg && (
        <div className="bg-green-100 border border-green-300 text-green-700 px-4 py-2 rounded">
          {successMsg}
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">

        <input
          disabled={!!initialData}
          className="border p-2 rounded"
          placeholder="Username"
          value={form.username}
          onChange={(e) =>
            setForm({ ...form, username: e.target.value })
          }
        />

        {!initialData && (
          <div className="relative">
            <input
              type={showPass ? "text" : "password"}
              className="border p-2 rounded w-full pr-10"
              placeholder="Password"
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
            />

            <button
              type="button"
              onClick={togglePassword}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-600 hover:text-black"
            >
              {showPass ? (
                // Eye Closed
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20C7 20 2.73 16.11 1 12c.73-1.68 1.79-3.18 3.06-4.44M9.9 4.24A10.94 10.94 0 0 1 12 4c5 0 9.27 3.89 11 8a11.05 11.05 0 0 1-4.24 5.36M1 1l22 22" />
                </svg>
              ) : (
                // Eye Open
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>
        )}


        <input
          className="border p-2 rounded"
          placeholder="Full Name"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        <input
          className="border p-2 rounded"
          placeholder="Employee ID"
          value={form.employeeId}
          onChange={(e) =>
            setForm({ ...form, employeeId: e.target.value })
          }
        />

        <input
          className="border p-2 rounded"
          placeholder="Designation"
          value={form.designation}
          onChange={(e) =>
            setForm({ ...form, designation: e.target.value })
          }
        />

        <select
          className="border p-2 rounded"
          value={form.department}
          onChange={(e) =>
            setForm({ ...form, department: e.target.value })
          }
        >
          <option value="">Select Department</option>
          <option value="Sales">Sales</option>
          <option value="IT">IT</option>
          <option value="HR">HR</option>
        </select>

        <input
          className="border p-2 rounded"
          placeholder="Phone"
          value={form.phone}
          onChange={(e) =>
            setForm({ ...form, phone: e.target.value })
          }
        />

        <input
          type="file"
          accept="image/png, image/jpeg"
          className="border p-2 rounded"
          onChange={(e) => handlePhoto(e.target.files[0])}
        />

        <select
          className="border p-2 rounded"
          value={form.role}
          onChange={(e) =>
            setForm({ ...form, role: e.target.value })
          }
        >
          <option value="STAFF">STAFF</option>
          <option value="ADMIN">ADMIN</option>
          <option value="VIEWER">VIEWER</option>
        </select>
      </div>

      <div className="flex justify-end gap-2">
        {onClose && (
          <button
            onClick={onClose}
            className="border px-4 py-2 rounded"
          >
            Cancel
          </button>
        )}

        <button
          onClick={submit}
          disabled={loading}
          className={`px-5 py-2 rounded text-white ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-slate-900"
          }`}
        >
          {loading
            ? "Saving..."
            : initialData
            ? "Update User"
            : "Create User"}
        </button>
      </div>
    </div>
  );
}
