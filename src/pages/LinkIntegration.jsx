import React, { useState, useEffect, useContext } from "react";
import {
  FaYoutube,
  FaInstagram,
  FaTiktok,
  FaFacebook,
  FaWhatsapp,
  FaTelegram,
  FaRocket,
  FaLink,
  FaHeadset,
  FaCheckCircle,
  FaTimes,
} from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";
import { updateSocialLinks, getProfile, getSocialLinks } from "../api/api";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import Footer from "./Footer";

const LinkIntegration = () => {
  const { token } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activityLink, setActivityLink] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [history, setHistory] = useState([]);
  const [systemSocialLinks, setSystemSocialLinks] = useState({
    whatsapp: "",
    telegram: "",
  });
  const [userSocialLinks, setUserSocialLinks] = useState({
    whatsapp: "",
    telegram: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, systemLinksRes] = await Promise.all([
          getProfile(token),
          getSocialLinks(),
        ]);

        if (profileRes.data.activityLinkHistory) {
          setHistory(profileRes.data.activityLinkHistory);
        }
        if (profileRes.data.socialLinks) {
          setUserSocialLinks({
            whatsapp: profileRes.data.socialLinks.whatsapp || "",
            telegram: profileRes.data.socialLinks.telegram || "",
          });
        }
        if (systemLinksRes.data.socialLinks) {
          setSystemSocialLinks(systemLinksRes.data.socialLinks);
        }
      } catch (error) {
        console.error("Error fetching links:", error);
        toast.error("Failed to load your social profile");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchData();
    }
  }, [token]);

  const handleSaveActivityLink = async () => {
    if (!activityLink) {
      toast.error("Please paste a link first");
      return;
    }
    setSaving(true);
    try {
      const res = await updateSocialLinks(token, {
        latestActivityLink: activityLink,
        platform: selectedPlatform,
      });
      setHistory(res.data.activityLinkHistory || []);
      setActivityLink(""); // Clear the input after successful addition
      setIsModalOpen(false);
      toast.success("Activity link added successfully");
    } catch (error) {
      console.error("Error updating activity link:", error);
      toast.error(error.response?.data?.error || "Failed to add link");
    } finally {
      setSaving(false);
    }
  };

  const [savingChannels, setSavingChannels] = useState(false);
  const handleUpdateUserChannels = async () => {
    setSavingChannels(true);
    try {
      const res = await updateSocialLinks(token, {
        whatsapp: userSocialLinks.whatsapp,
        telegram: userSocialLinks.telegram,
      });
      setUserSocialLinks({
        whatsapp: res.data.socialLinks.whatsapp || "",
        telegram: res.data.socialLinks.telegram || "",
      });
      toast.success("Community channels updated");
    } catch (error) {
      console.error("Error updating channels:", error);
      toast.error("Failed to update channels");
    } finally {
      setSavingChannels(false);
    }
  };

  const openLinkModal = (platform) => {
    setSelectedPlatform(platform);
    setIsModalOpen(true);
  };

  if (loading) return <Spinner />;

  return (
    <div className="max-w-6xl mx-auto p-4 pt-10 pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Join the Inner Circle - Full width on top */}
        <div className="lg:col-span-12 bg-white rounded-2xl p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-6 text-center md:text-left relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-full -mr-16 -mt-16 z-0 opacity-50" />
          <div className="bg-orange-50 p-5 rounded-full z-10">
            <FaRocket className="text-orange-500 text-3xl" />
          </div>
          <div className="flex-grow z-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Join the Inner Circle
            </h2>
            <p className="text-gray-500 max-w-2xl">
              Become a Partner Seller. Team members enjoy exclusive weekly
              gifts, performance bonuses, and premium benefits. Experience the
              full potential of PSC.
            </p>
          </div>
        </div>

        {/* Main Content: Social Hub & Activity Verification */}
        <div className="lg:col-span-12 flex flex-col gap-6">
          {/* Content Distribution Hub */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-blue-50 p-3 rounded-lg">
                <FaLink className="text-blue-500 text-xl" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">
                Content Distribution Hub
              </h2>
            </div>
            <p className="text-gray-500 mb-8">
              Connect your social channels to start tracking your reach across
              all major platforms.
            </p>

            <div className="flex flex-wrap justify-center sm:justify-start gap-8 py-4">
              <div
                className="flex flex-col items-center gap-2 group cursor-pointer"
                onClick={() => openLinkModal("YouTube")}
              >
                <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-all duration-300">
                  <FaYoutube size={32} />
                </div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  YouTube
                </span>
              </div>
              <div
                className="flex flex-col items-center gap-2 group cursor-pointer"
                onClick={() => openLinkModal("Facebook")}
              >
                <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-all duration-300">
                  <FaFacebook size={32} />
                </div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Facebook
                </span>
              </div>
              <div
                className="flex flex-col items-center gap-2 group cursor-pointer"
                onClick={() => openLinkModal("Instagram")}
              >
                <div className="w-16 h-16 bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-all duration-300">
                  <FaInstagram size={32} />
                </div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Instagram
                </span>
              </div>
              <div
                className="flex flex-col items-center gap-2 group cursor-pointer"
                onClick={() => openLinkModal("TikTok")}
              >
                <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-all duration-300">
                  <FaTiktok size={32} />
                </div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  TikTok
                </span>
              </div>
            </div>
          </div>

          {/* User Channels Integration Card */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-green-50 p-3 rounded-lg">
                <FaHeadset className="text-green-500 text-xl" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">
                Partner Community Setup
              </h2>
            </div>
            <p className="text-gray-500 mb-8">
              Link your personal WhatsApp and Telegram channels for your team
              members to join.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                  WhatsApp Channel Link
                </label>
                <div className="flex items-center bg-gray-50 rounded-xl overflow-hidden border-2 border-transparent focus-within:border-green-200 transition-all">
                  <div className="pl-4 text-green-500">
                    <FaWhatsapp size={20} />
                  </div>
                  <input
                    type="text"
                    placeholder="https://chat.whatsapp.com/..."
                    className="w-full bg-transparent p-4 outline-none text-sm placeholder:text-gray-300"
                    value={userSocialLinks.whatsapp}
                    onChange={(e) =>
                      setUserSocialLinks({
                        ...userSocialLinks,
                        whatsapp: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                  Telegram Channel Link
                </label>
                <div className="flex items-center bg-gray-50 rounded-xl overflow-hidden border-2 border-transparent focus-within:border-blue-200 transition-all">
                  <div className="pl-4 text-blue-500">
                    <FaTelegram size={20} />
                  </div>
                  <input
                    type="text"
                    placeholder="https://t.me/yourchannel"
                    className="w-full bg-transparent p-4 outline-none text-sm placeholder:text-gray-300"
                    value={userSocialLinks.telegram}
                    onChange={(e) =>
                      setUserSocialLinks({
                        ...userSocialLinks,
                        telegram: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </div>

            <button
              onClick={handleUpdateUserChannels}
              disabled={savingChannels}
              className="mt-8 bg-gray-900 text-white font-bold px-10 py-4 rounded-xl hover:bg-black transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
            >
              {savingChannels ? "SAVING..." : "SAVE CHANNELS"}
            </button>
          </div>

          {/* Activity History Card */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-orange-50 p-3 rounded-lg">
                <FaLink className="text-orange-500 text-xl" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">
                Review Activity Link History
              </h2>
            </div>

            <div className="overflow-x-auto">
              {history.length > 0 ? (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="pb-4 font-bold text-gray-600 text-sm">
                        #
                      </th>
                      <th className="pb-4 font-bold text-gray-600 text-sm">
                        Platform
                      </th>
                      <th className="pb-4 font-bold text-gray-600 text-sm">
                        Submit Time
                      </th>
                      <th className="pb-4 font-bold text-gray-600 text-sm">
                        Submit Links
                      </th>
                      <th className="pb-4 font-bold text-gray-600 text-sm">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {history.map((item, index) => (
                      <tr
                        key={index}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="py-4 text-sm text-gray-500">
                          {history.length - index}
                        </td>
                        <td className="py-4 text-sm font-semibold text-gray-700 uppercase">
                          {item.platform || "N/A"}
                        </td>
                        <td className="py-4 text-sm text-gray-500">
                          {new Date(item.date).toLocaleString()}
                        </td>
                        <td className="py-4 text-sm">
                          <a
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline break-all block max-w-xs sm:max-w-md lg:max-w-sm"
                          >
                            {item.link}
                          </a>
                        </td>
                        <td className="py-4">
                          <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded uppercase">
                            Submitted
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center py-10">
                  <div className="text-4xl mb-3">📂</div>
                  <p className="text-gray-400">No activity history found.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <Footer />
      </div>

      {/* ADD LINK MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden transform animate-in zoom-in-95 duration-300">
            <div className="relative p-8">
              {/* Close Button */}
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 bg-gray-100 hover:bg-gray-200 p-2 rounded-full transition-all"
              >
                <FaTimes size={18} />
              </button>

              <div className="flex items-center gap-3 mb-6">
                <div className="bg-green-50 p-3 rounded-2xl">
                  <FaLink className="text-green-500 text-2xl" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    Add {selectedPlatform} Link
                  </h2>
                  <p className="text-sm text-gray-500">
                    Paste your video/post link for verification
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-600 mb-2 uppercase tracking-wide">
                    Paste {selectedPlatform} URL
                  </label>
                  <input
                    type="text"
                    placeholder={`https://${selectedPlatform.toLowerCase()}.com/...`}
                    className="w-full bg-gray-50 p-4 rounded-2xl outline-none text-base border-2 border-dashed border-gray-200 focus:border-green-400 focus:bg-white transition-all"
                    value={activityLink}
                    onChange={(e) => setActivityLink(e.target.value)}
                    autoFocus
                  />
                </div>

                <button
                  onClick={handleSaveActivityLink}
                  disabled={saving}
                  className="w-full bg-green-500 text-white font-bold py-4 rounded-2xl hover:bg-green-600 flex items-center justify-center gap-3 disabled:opacity-50 shadow-xl shadow-green-100 transition-all active:scale-95"
                >
                  <FaCheckCircle size={22} />
                  <span className="text-lg">
                    {saving ? "ADDING..." : "ADD LINK"}
                  </span>
                </button>

                <p className="text-center text-xs text-gray-400">
                  * By submitting, you agree to our terms of social media
                  activity verification.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LinkIntegration;
