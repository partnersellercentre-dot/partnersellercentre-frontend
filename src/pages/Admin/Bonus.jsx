import React, { useEffect, useState } from "react";
import { getSystemSettings, updateSystemSettings } from "../../api/api";
import { toast } from "react-toastify";

function Bonus() {
  const [signupBonus, setSignupBonus] = useState(0);
  const [referralBonus, setReferralBonus] = useState(0);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await getSystemSettings(token);
        setSignupBonus(data.signupBonus || 0);
        setReferralBonus(data.referralBonus || 0);
      } catch (error) {
        toast.error("Failed to load settings");
      }
    };
    fetchSettings();
  }, [token]);

  const handleUpdate = async () => {
    try {
      setLoading(true);
      await updateSystemSettings(token, { signupBonus, referralBonus });
      toast.success("Bonus settings updated successfully!");
    } catch (error) {
      toast.error("Failed to update bonus");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <h2 className="text-2xl font-bold mb-6">Bonus Settings</h2>
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-md">
        <label className="block mb-4">
          <span className="text-gray-400">Signup Bonus Amount ($)</span>
          <input
            type="number"
            className="w-full mt-1 p-2 bg-gray-700 border border-gray-600 rounded focus:border-blue-500 focus:outline-none"
            value={signupBonus}
            onChange={(e) => setSignupBonus(Number(e.target.value))}
          />
        </label>
        <label className="block mb-6">
          <span className="text-gray-400">Referral Bonus Amount ($)</span>
          <input
            type="number"
            className="w-full mt-1 p-2 bg-gray-700 border border-gray-600 rounded focus:border-blue-500 focus:outline-none"
            value={referralBonus}
            onChange={(e) => setReferralBonus(Number(e.target.value))}
          />
        </label>
        <button
          onClick={handleUpdate}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-200"
        >
          {loading ? "Updating..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}

export default Bonus;
