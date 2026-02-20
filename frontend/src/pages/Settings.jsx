import { useAuth } from "../auth/AuthContext";
import { useState, useEffect } from "react";
import api from "../api/axios";

export default function Settings() {
  const { role, user } = useAuth();

  const [profile, setProfile] = useState({
    name: "",
    phone: "",
    designation: "",
    photo: "",
  });

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
  });

  const [departmentUsers, setDepartmentUsers] = useState([]);
  const [sessionTimeout, setSessionTimeout] = useState(15);
  const [message, setMessage] = useState("");

  /* ================= INITIAL LOAD ================= */

  useEffect(() => {
    if (!role) return;

    if (user) {
      setProfile({
        name: user.name || "",
        phone: user.phone || "",
        designation: user.designation || "",
        photo: user.photo || "",
      });
    }

    if (role === "ADMIN") {
      loadDepartmentUsers();
    }

    if (role === "SUPER_ADMIN") {
      loadSessionTimeout();
    }
  }, [role, user]);

  /* ================= LOAD SESSION TIMEOUT ================= */

  const loadSessionTimeout = async () => {
    try {
      const res = await api.get("/settings/session-timeout");

      if (res.data && typeof res.data.timeout === "number") {
        setSessionTimeout(res.data.timeout);
      }
    } catch (err) {
      console.error("Failed to load session timeout", err);
    }
  };

  /* ================= UPDATE SESSION TIMEOUT ================= */

  const updateSessionTimeout = async () => {
    try {
      const res = await api.post("/settings/session-timeout", {
        timeout: Number(sessionTimeout),
      });

      if (res.data && typeof res.data.timeout === "number") {
        setSessionTimeout(res.data.timeout);
      }

      setMessage("Session timeout updated");
    } catch (err) {
      console.error(err);
      setMessage("Failed to update session timeout");
    }
  };

  /* ================= LOAD DEPARTMENT USERS ================= */

  const loadDepartmentUsers = async () => {
    try {
      const res = await api.get("/users?department=" + user?.department);
      setDepartmentUsers(res.data || []);
    } catch {
      setDepartmentUsers([]);
    }
  };

  /* ================= PROFILE PHOTO ================= */

  const handlePhoto = (file) => {
    if (!file) return;

    if (!["image/jpeg", "image/png"].includes(file.type)) {
      setMessage("Only JPG and PNG allowed");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () =>
      setProfile((p) => ({ ...p, photo: reader.result }));
    reader.readAsDataURL(file);
  };

  /* ================= UPDATE PROFILE ================= */

  const updateProfile = async () => {
    try {
      await api.patch(`/users/${user._id}`, profile);
      setMessage("Profile updated successfully");
    } catch {
      setMessage("Failed to update profile");
    }
  };

  /* ================= CHANGE PASSWORD ================= */

  const changePassword = async () => {
    try {
      await api.post("/auth/change-password", passwords);
      setPasswords({ currentPassword: "", newPassword: "" });
      setMessage("Password changed successfully");
    } catch {
      setMessage("Password change failed");
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Settings</h1>

      {/* ================= SUPER ADMIN ================= */}
      {role === "SUPER_ADMIN" && (
        <div className="space-y-6">

          <div className="bg-white rounded-xl shadow p-4">
            <h2 className="font-medium mb-3">Logs</h2>
            <ul className="list-disc ml-6 text-sm space-y-1">
              <li>User Login History</li>
              <li>User Activity Log</li>
              <li>Stock Modification Log</li>
            </ul>
          </div>

          <div className="bg-white rounded-xl shadow p-4 space-y-3">
            <h2 className="font-medium">
              Session Timeout Duration (minutes)
            </h2>

            <div className="flex gap-3 items-center">
              <input
                type="number"
                min="1"
                className="border p-2 rounded w-32"
                value={sessionTimeout}
                onChange={(e) => setSessionTimeout(e.target.value)}
              />
              <button
                onClick={updateSessionTimeout}
                className="bg-slate-900 text-white px-4 py-2 rounded"
              >
                Update
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-4">
            <h2 className="font-medium mb-3">Access Control</h2>
            <ul className="list-disc ml-6 text-sm space-y-1">
              <li>View Role Privileges</li>
              <li>Enable / Disable Module Access</li>
              <li>Custom Permission Matrix (Future)</li>
            </ul>
          </div>

        </div>
      )}

      {/* ================= ADMIN ================= */}
      {role === "ADMIN" && (
        <div className="space-y-6">

          <div className="bg-white rounded-xl shadow p-4">
            <h2 className="font-medium mb-3">
              Department Staff Users
            </h2>
            <ul className="text-sm space-y-1">
              {departmentUsers
                .filter((u) => u.role === "STAFF")
                .map((u) => (
                  <li key={u._id}>
                    {u.name} ({u.username})
                  </li>
                ))}
            </ul>
          </div>

          <PersonalSettings
            profile={profile}
            setProfile={setProfile}
            passwords={passwords}
            setPasswords={setPasswords}
            updateProfile={updateProfile}
            changePassword={changePassword}
            handlePhoto={handlePhoto}
          />
        </div>
      )}

      {/* ================= STAFF ================= */}
      {role === "STAFF" && (
        <PersonalSettings
          profile={profile}
          setProfile={setProfile}
          passwords={passwords}
          setPasswords={setPasswords}
          updateProfile={updateProfile}
          changePassword={changePassword}
          handlePhoto={handlePhoto}
        />
      )}

      {message && (
        <div className="bg-green-100 text-green-700 p-3 rounded">
          {message}
        </div>
      )}
    </div>
  );
}

/* ================= PERSONAL SETTINGS COMPONENT ================= */

function PersonalSettings({
  profile,
  setProfile,
  passwords,
  setPasswords,
  updateProfile,
  changePassword,
  handlePhoto,
}) {
  return (
    <div className="space-y-6">

      <div className="bg-white rounded-xl shadow p-4 space-y-4">
        <h2 className="font-medium">Edit Profile</h2>

        <div className="flex items-center gap-4">
          <img
            src={profile.photo || "/avatar.png"}
            alt="Profile"
            className="w-20 h-20 rounded-full object-cover border"
          />

          <input
            type="file"
            accept="image/png, image/jpeg"
            onChange={(e) => handlePhoto(e.target.files[0])}
          />
        </div>

        <input
          className="border p-2 rounded w-full"
          placeholder="Full Name"
          value={profile.name}
          onChange={(e) =>
            setProfile({ ...profile, name: e.target.value })
          }
        />

        <input
          className="border p-2 rounded w-full"
          placeholder="Phone"
          value={profile.phone}
          onChange={(e) =>
            setProfile({ ...profile, phone: e.target.value })
          }
        />

        <input
          className="border p-2 rounded w-full"
          placeholder="Designation"
          value={profile.designation}
          onChange={(e) =>
            setProfile({
              ...profile,
              designation: e.target.value,
            })
          }
        />

        <button
          onClick={updateProfile}
          className="bg-slate-900 text-white px-4 py-2 rounded"
        >
          Update Profile
        </button>
      </div>

      <div className="bg-white rounded-xl shadow p-4 space-y-3">
        <h2 className="font-medium">Change Password</h2>

        <input
          type="password"
          className="border p-2 rounded w-full"
          placeholder="Current Password"
          value={passwords.currentPassword}
          onChange={(e) =>
            setPasswords({
              ...passwords,
              currentPassword: e.target.value,
            })
          }
        />

        <input
          type="password"
          className="border p-2 rounded w-full"
          placeholder="New Password"
          value={passwords.newPassword}
          onChange={(e) =>
            setPasswords({
              ...passwords,
              newPassword: e.target.value,
            })
          }
        />

        <button
          onClick={changePassword}
          className="bg-slate-900 text-white px-4 py-2 rounded"
        >
          Change Password
        </button>
      </div>

    </div>
  );
}