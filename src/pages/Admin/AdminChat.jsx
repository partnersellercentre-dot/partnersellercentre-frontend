import React, { useState, useEffect, useContext, useRef } from "react";
import { AuthContext } from "../../context/AuthContext";
import { getChatUsers, getAdminUserMessages, replyToUser } from "../../api/api";
import Pusher from "pusher-js";
import { toast } from "react-toastify";

function AdminChat() {
  const { token, user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    fetchUsers();

    const pusher = new Pusher(import.meta.env.VITE_PUSHER_APP_KEY, {
      cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
    });

    const channel = pusher.subscribe("admin-chat");
    channel.bind("new-message", (data) => {
      // Refresh user list to show latest message/new user
      fetchUsers();

      // If the message is from the currently selected user, add it to messages
      if (selectedUser && data.message.user === selectedUser._id) {
        setMessages((prev) => [...prev, data.message]);
      }
    });

    return () => {
      pusher.unsubscribe("admin-chat");
    };
  }, [selectedUser]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchUsers = async () => {
    try {
      const res = await getChatUsers(token);
      setUsers(res.data.users);
    } catch (err) {
      console.error("Failed to fetch chat users", err);
    }
  };

  const handleSelectUser = async (user) => {
    setSelectedUser(user);
    try {
      const res = await getAdminUserMessages(token, user._id);
      setMessages(res.data.messages);
    } catch (err) {
      toast.error("Failed to fetch messages");
    }
  };

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser) return;

    try {
      const res = await replyToUser(token, selectedUser._id, newMessage);
      setMessages((prev) => [...prev, res.data.message]);
      setNewMessage("");
      fetchUsers(); // Update last message in sidebar
    } catch (err) {
      toast.error("Failed to send reply");
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-100px)] bg-gray-900 text-white rounded-xl overflow-hidden shadow-2xl border border-gray-700">
      {/* Users List Sidebar */}
      <div className="w-full md:w-1/3 border-r border-gray-700 bg-gray-800 flex flex-col">
        <div className="p-4 border-b border-gray-700 bg-gray-800">
          <h2 className="text-xl font-bold text-green-500">Conversations</h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          {users.map((u) => (
            <div
              key={u._id}
              onClick={() => handleSelectUser(u)}
              className={`p-4 cursor-pointer border-b border-gray-700 hover:bg-gray-700 transition ${
                selectedUser?._id === u._id
                  ? "bg-gray-700 border-l-4 border-l-green-500"
                  : ""
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-gray-100">
                    {u.name || u.email}
                  </h3>
                  <p className="text-sm text-gray-400 truncate w-40">
                    {u.lastMessage?.message || "No messages yet"}
                  </p>
                </div>
                <span className="text-xs text-gray-500">
                  {u.lastMessage &&
                    new Date(u.lastMessage.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                </span>
              </div>
            </div>
          ))}
          {users.length === 0 && (
            <div className="p-4 text-center text-gray-500">
              No conversations yet
            </div>
          )}
        </div>
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col bg-gray-900">
        {selectedUser ? (
          <>
            <div className="p-4 border-b border-gray-700 bg-gray-800 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-100">
                Chat with{" "}
                <span className="text-green-400">
                  {selectedUser.name || selectedUser.email}
                </span>
              </h3>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-600">
              {messages.map((msg, idx) => (
                <div
                  key={msg._id || idx}
                  className={`flex ${msg.isAdmin ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[75%] p-3 rounded-2xl shadow-md ${
                      msg.isAdmin
                        ? "bg-green-600 text-white rounded-tr-none"
                        : "bg-gray-700 text-gray-100 rounded-tl-none border border-gray-600"
                    }`}
                  >
                    <p className="text-sm">{msg.message}</p>
                    <span
                      className={`text-[10px] block mt-1 ${msg.isAdmin ? "text-green-100" : "text-gray-400"}`}
                    >
                      {new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <form
              onSubmit={handleSendReply}
              className="p-4 border-t border-gray-700 bg-gray-800"
            >
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your reply..."
                  className="flex-1 bg-gray-900 border border-gray-700 text-white rounded-full px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none transition"
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white font-bold py-2 px-6 rounded-full transition-all"
                >
                  Send
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500 flex-col gap-4">
            <svg
              className="w-16 h-16 opacity-20"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
              <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.59.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
            </svg>
            <p className="text-xl">Select a conversation to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminChat;
