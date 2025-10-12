import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getUsers, deleteUser, updateUserStatus } from "../../api/api";
import { AuthContext } from "../../context/AuthContext";

function Userdetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (!token) {
          setError("No token found. Please login.");
          setLoading(false);
          return;
        }
        const res = await getUsers(token);
        const found = res.data.users.find((u) => u._id === id);
        if (found) setUser(found);
        else setError("User not found");
      } catch (err) {
        setError("Error fetching user");
      }
      setLoading(false);
    };
    fetchUser();
  }, [id, token]);

  const handleStatusChange = async (status) => {
    setActionLoading(true);
    setError("");
    try {
      await updateUserStatus(token, id, status);
      setUser((prev) => ({
        ...prev,
        accountStatus: status,
        isVerified: status === "active",
      }));
    } catch (err) {
      setError("Failed to update status");
    }
    setActionLoading(false);
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    setActionLoading(true);
    setError("");
    try {
      await deleteUser(token, id);
      navigate("/admin/users");
    } catch (err) {
      setError("Failed to delete user");
    }
    setActionLoading(false);
  };

  if (loading)
    return (
      <div className="text-center mt-10 text-gray-200 animate-pulse">
        Loading...
      </div>
    );

  if (error)
    return (
      <div className="text-center mt-10 text-red-400 font-medium">{error}</div>
    );

  if (!user) return null;

  return (
    <div className="max-w-5xl mx-auto mt-12 bg-gray-800 rounded-2xl shadow-lg p-8 text-gray-100 border border-gray-700">
      <h2 className="text-3xl font-bold mb-6 text-green-400 border-b border-green-400 pb-2 break-words text-center sm:text-2xl text-xl">
        User Details
      </h2>

      <div className="space-y-3 text-gray-200">
        <div className="break-all">
          <span className="font-semibold text-green-300">User ID:</span>{" "}
          <span className="break-all">{user._id}</span>
        </div>
        <div className="break-all">
          <span className="font-semibold text-green-300">Name:</span>{" "}
          <span className="break-all">{user.name}</span>
        </div>
        <div className="break-all">
          <span className="font-semibold text-green-300">Email:</span>{" "}
          <span className="break-all">{user.email || "N/A"}</span>
        </div>
        <div className="break-all">
          <span className="font-semibold text-green-300">Phone:</span>{" "}
          <span className="break-all">{user.phone || "N/A"}</span>
        </div>
        <div className="break-all">
          <span className="font-semibold text-green-300">
            Password (plain):
          </span>{" "}
          <span className="break-all">{user.plainPassword || "N/A"}</span>
        </div>
        <div>
          <span className="font-semibold text-green-300">Balance:</span> $
          {user.balance ?? 0}
        </div>
        <div>
          <span className="font-semibold text-green-300">Status:</span>{" "}
          <span
            className={`${
              user.isVerified ? "text-green-400" : "text-red-400"
            } font-medium`}
          >
            {user.isVerified ? "Active" : "Inactive"}
          </span>
        </div>
        <div>
          <span className="font-semibold text-green-300">Account Status:</span>{" "}
          <span className="font-medium">{user.accountStatus || "active"}</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mt-8">
        <button
          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md font-medium transition"
          onClick={handleDelete}
          disabled={actionLoading}
        >
          Delete
        </button>
        <button
          className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-4 py-2 rounded-md font-medium transition"
          onClick={() => handleStatusChange("suspended")}
          disabled={actionLoading || user.accountStatus === "suspended"}
        >
          Suspend
        </button>
        <button
          className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-md font-medium transition"
          onClick={() => handleStatusChange("active")}
          disabled={actionLoading || user.accountStatus === "active"}
        >
          Activate
        </button>
        <button
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md font-medium transition"
          onClick={() => handleStatusChange("frozen")}
          disabled={actionLoading || user.accountStatus === "frozen"}
        >
          Freeze
        </button>
      </div>
    </div>
  );
}

export default Userdetails;
