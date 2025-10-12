import React, { useState, useEffect, useContext } from "react";
import { FaTrashAlt } from "react-icons/fa";
import { getUsers, deleteUser } from "../../api/api";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext"; // Import AuthContext

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { token } = useContext(AuthContext); // Get token from context

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        if (!token) {
          setError("No token found. Please login.");
          setLoading(false);
          return;
        }

        const response = await getUsers(token);
        if (response.status === 200) {
          setUsers(response.data.users);
        } else {
          setError("Failed to fetch users");
        }
        setLoading(false);
      } catch (err) {
        setError("Error fetching users");
        setLoading(false);
      }
    };

    fetchUsers();
  }, [token]);

  const handleDeleteUser = async (id) => {
    try {
      if (!token) {
        setError("No token found. Please login.");
        return;
      }

      const response = await deleteUser(token, id);
      if (response.status === 200) {
        setUsers(users.filter((user) => user._id !== id));
      } else {
        setError("Failed to delete user");
      }
    } catch (error) {
      setError("Error deleting user");
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-start items-center px-6">
      <div className="max-w-7xl w-full">
        {loading && <p>Loading users...</p>}
        {error && <p className="text-red-500">{error}</p>}

        <div className="bg-gray-800 rounded-lg shadow-md">
          <div className="max-h-[400px] overflow-y-auto">
            <table className="min-w-full text-sm text-left text-gray-300">
              <thead className="bg-gray-700 text-gray-100 sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Role</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id} className="border-b border-gray-600">
                    <td className="px-6 py-3">{user.name}</td>
                    <td className="px-6 py-3">{user.email}</td>
                    <td className="px-6 py-3">{user.role}</td>
                    <td className="px-6 py-3 flex space-x-4">
                      <button
                        onClick={() => navigate(`/admin/users/${user._id}`)}
                        className="text-blue-500 hover:text-blue-600"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user._id)}
                        className="text-red-500 hover:text-red-600"
                      >
                        <FaTrashAlt />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Users;
