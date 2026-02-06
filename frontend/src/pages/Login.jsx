import api from "../api/axios";
import { useAuth } from "../auth/AuthContext";
import { useState } from "react";
import { User, Lock, Settings } from "lucide-react";

export default function Login() {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const submit = async () => {
    try {
      setIsLoading(true);
      const res = await api.post("/auth/login", { username, password });
      const expiresAt = Date.now() + 15 * 60 * 1000;

      localStorage.setItem(
        "auth",
        JSON.stringify({
          token: res.data.token,
          role: res.data.role,
          expiresAt,
        })
      );

      login(res.data.token, res.data.role);
    } catch (error) {
      console.error("Login failed", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#1a202c] flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-500 rounded-full blur-3xl"></div>
      </div>

      {/* Card */}
      <div className="bg-slate-50 rounded-2xl shadow-2xl w-full max-w-md p-8 z-10 mx-4">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="text-3xl font-bold text-gray-900 flex items-center gap-1">
            InventoX
            <Settings className="w-6 h-6 text-gray-700 animate-spin-slow" />
          </div>
        </div>

        <h2 className="text-gray-600 text-center mb-8 text-lg font-medium">
          Login to your account
        </h2>

        <div className="space-y-4">
          {/* Username */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="Username"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          {/* Password with Eye */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>

            <input
              type={showPass ? "text" : "password"}
              className="block w-full pl-10 pr-10 py-3 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />

            {/* Eye button */}
            <button
              type="button"
              onClick={() => setShowPass(p => !p)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPass ? (
                // Eye Closed
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20C7 20 2.73 16.11 1 12c.73-1.68 1.79-3.18 3.06-4.44M9.9 4.24A10.94 10.94 0 0 1 12 4c5 0 9.27 3.89 11 8a11.05 11.05 0 0 1-4.24 5.36M1 1l22 22"/>
                </svg>
              ) : (
                // Eye Open
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
              )}
            </button>
          </div>

          {/* Button */}
          <div className="pt-4 flex justify-center">
            <button
              onClick={submit}
              disabled={isLoading}
              className="bg-[#1e2532] hover:bg-[#2d3748] text-white font-bold py-2 px-8 rounded shadow-md"
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-12 text-center text-gray-400 text-sm z-10">
        All copyright reserved InventoX
      </div>
    </div>
  );
}
