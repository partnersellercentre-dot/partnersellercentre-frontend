import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { updateProfile } from "../api/api";
import {
  FaUser,
  FaEnvelope,
  FaLevelUpAlt,
  FaWallet,
  FaShareAlt,
  FaCheckCircle,
  FaEdit,
  FaCamera,
} from "react-icons/fa";

export default function Profile() {
  const { user, token, setUser } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(false);
  if (!user) {
    return <p className="text-center mt-10">Loading profile...</p>;
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setLoading(true);
      const { data } = await updateProfile(token, { profileImage: file });
      setUser(data.user); // update context with new image
      setProfileImage(null);
      alert("Profile image updated!");
    } catch (err) {
      console.error("Image upload error:", err);
      alert(
        "Error uploading image: " + (err.response?.data?.error || err.message)
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCopyReferral = () => {
    navigator.clipboard.writeText(user.referralCode || "N/A");
    alert("Referral code copied to clipboard!");
  };

  const handleSaveName = async () => {
    try {
      setLoading(true);
      const { data } = await updateProfile(token, { name, profileImage });
      setUser(data.user); // update AuthContext
      setIsEditing(false);
      alert("Profile updated!");
    } catch (err) {
      console.error("Update profile error:", err);

      alert(
        "Error updating profile: " + err.response?.data?.error || err.message
      );
    } finally {
      setLoading(false);
    }
  };

  const profileItems = [
    {
      label: "Name",
      value: isEditing ? (
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border px-2 py-1 rounded-md text-sm w-full"
          />
          <button
            onClick={handleSaveName}
            disabled={loading}
            className="px-3 py-1 text-white bg-green-600 hover:bg-green-700 rounded-md text-sm"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <span>{user.name}</span>
          <button
            onClick={() => setIsEditing(true)}
            className="text-green-600 hover:text-green-700"
          >
            <FaEdit />
          </button>
        </div>
      ),
      icon: <FaUser />,
    },
    { label: "Email", value: user.email || user.name, icon: <FaEnvelope /> },
    {
      label: "Account Level",
      value: user.accountLevel,
      icon: <FaLevelUpAlt />,
    },
    {
      label: "Wallet Balance",
      value: `$${user.balance}`,
      icon: <FaWallet />,
    },
    {
      label: "Referral Code",
      value: (
        <div className="flex items-center gap-2">
          <span>{user.referralCode}</span>
          <button
            onClick={handleCopyReferral}
            className="px-2 py-1 text-xs font-medium bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Copy
          </button>
        </div>
      ),
      icon: <FaShareAlt />,
    },
    {
      label: "Verified",
      value: user.isVerified ? "Yes" : "No",
      icon: <FaCheckCircle />,
    },
  ];

  return (
    <div className="p-6 min-h-screen bg-gray-50 w-full">
      {/* Header */}
      <h1 className="text-3xl font-bold text-green-600 mb-6">My Profile</h1>

      {/* Profile Card */}
      <div className="bg-white shadow-lg rounded-2xl p-6 w-full border border-gray-100">
        <div className="flex items-center gap-4 pb-6 border-b border-gray-200 relative">
          {/* Profile Image or Initial */}
          <div className="relative">
            {user.profileImage ? (
              <img
                src={user.profileImage}
                alt="Profile"
                className="w-16 h-16 rounded-full object-cover border-2 border-green-500"
              />
            ) : (
              <div className="w-16 h-16 bg-green-100 text-green-600 flex items-center justify-center rounded-full text-2xl font-bold">
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
            <label className="absolute bottom-0 right-0 bg-green-600 p-1 rounded-full cursor-pointer text-white">
              <FaCamera size={14} />
              <input
                type="file"
                className="hidden"
                onChange={handleImageUpload}
              />
            </label>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800 capitalize">
              {user.name}
            </h2>
            <p className="text-gray-500 text-sm">
              {user.isVerified ? "Verified User" : "Unverified"}
            </p>
          </div>
        </div>

        {/* Details Grid */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {profileItems.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 bg-gray-50 hover:bg-green-50 transition rounded-lg p-4"
            >
              <span className="text-green-600 text-lg">{item.icon}</span>
              <div>
                <p className="text-gray-500 text-sm">{item.label}</p>
                <div className="font-medium text-gray-800">{item.value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
