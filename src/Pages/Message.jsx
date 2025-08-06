import React, { useEffect, useState, useRef,useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import newRequest from "../utils/newRequest";
import { io } from "socket.io-client";
import toast, { Toaster } from "react-hot-toast";

const Message = () => {
  const { id } = useParams();
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const queryClient = useQueryClient();
  const [socket, setSocket] = useState(null);
  const scrollRef = useRef();

  // --- Data Fetching ---

  // 1. Fetch the conversation details first to find out who the other user is.
  const { data: conversationData } = useQuery({
      queryKey: ["conversation", id],
      queryFn: () => newRequest.get(`/conversations/single/${id}`).then(res => res.data)
  });

  // 2. Determine the ID of the other user in the chat.
  const otherUserId = useMemo(() => {
      if (!conversationData) return null;
      return conversationData.sellerId === currentUser._id 
          ? conversationData.buyerId 
          : conversationData.sellerId;
  }, [conversationData, currentUser._id]);

  // 3. Fetch the details of the other user using their ID.
  const { data: otherUser } = useQuery({
      queryKey: ['user', otherUserId],
      queryFn: () => newRequest.get(`/users/${otherUserId}`).then(res => res.data),
      enabled: !!otherUserId, // Only run this query when we have the otherUserId
  });

  // 4. Fetch the messages for this conversation.
  const { isLoading, error, data: messages, refetch } = useQuery({
    queryKey: ["messages", id],
    queryFn: () => newRequest.get(`/messages/${id}`).then((res) => res.data),
  });

  // --- Effects ---

  // Effect for Socket.IO connection
  useEffect(() => {
    const newSocket = io("http://localhost:4000");
    setSocket(newSocket);
    newSocket.emit("newUser", currentUser._id);
    newSocket.on("getMessage", () => {
      refetch();
    });
    return () => {
      newSocket.disconnect();
    };
  }, [currentUser._id, refetch]);

  // Effect to scroll to the bottom of the chat on new messages
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // --- Mutations ---
  const mutation = useMutation({
    mutationFn: (message) => {
      return newRequest.post(`/messages`, message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["messages", id]);
    },
  });

  // --- Event Handlers ---
  const handleSubmit = (e) => {
    e.preventDefault();
    const desc = e.target[0].value.trim();
    if (!desc || !otherUserId) return;

    socket.emit("sendMessage", {
        receiverId: otherUserId,
        data: {
            conversationId: id,
            userId: currentUser._id,
            desc: desc,
        },
    });

    mutation.mutate({
      conversationId: id,
      desc: desc,
    });
    e.target[0].value = "";
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
        <Toaster position="top-center" />
        <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    <div className="flex items-center gap-4">
                        <Link to="/messages" className="text-gray-600 hover:text-purple-700">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                        </Link>
                        {otherUser && (
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                                    {otherUser.username?.charAt(0).toUpperCase()}
                                </div>
                                <h1 className="text-xl font-bold text-gray-900">{otherUser.username}</h1>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>

        <main className="flex-grow">
            <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                {isLoading ? (
                    <div className="text-center text-gray-600">Loading messages...</div>
                ) : error ? (
                    <div className="text-center text-red-500">Error loading messages.</div>
                ) : (
                    // ✅ FIX: Added container with border and shadow for a professional chat box look
                    <div className="bg-white h-[65vh] flex flex-col p-6 border border-gray-200 rounded-lg shadow-md">
                        <div className="flex-grow overflow-y-auto pr-4 space-y-6">
                            {messages.map((m) => (
                                <div
                                    key={m._id}
                                    className={`flex gap-3 max-w-lg ${
                                        m.userId === currentUser._id ? "ml-auto flex-row-reverse" : "mr-auto"
                                    }`}
                                >
                                    <div
                                        className={`p-4 rounded-2xl shadow ${
                                            m.userId === currentUser._id
                                            ? "bg-purple-600 text-white rounded-br-none"
                                            : "bg-gray-200 text-gray-800 rounded-bl-none"
                                        }`}
                                    >
                                        <p>{m.desc}</p>
                                    </div>
                                </div>
                            ))}
                            <div ref={scrollRef} />
                        </div>
                        {/* ✅ FIX: Added a top border for clean separation */}
                        <div className="mt-6 pt-6 border-t border-gray-200">
                            <form className="flex items-center gap-3" onSubmit={handleSubmit}>
                                <textarea
                                    className="w-full p-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                                    placeholder="Type your message..."
                                    rows="2"
                                />
                                <button type="submit" className="bg-purple-600 text-white font-semibold px-6 py-4 rounded-xl hover:bg-purple-700 transition-colors cursor-pointer">
                                    Send
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </main>
    </div>
  );
};

export default Message;
