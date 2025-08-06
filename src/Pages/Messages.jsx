import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import newRequest from "../utils/newRequest";
import moment from "moment";
import { io } from "socket.io-client";
import toast, { Toaster } from 'react-hot-toast';
import Navbar from "../Component/Navbar"; // ✅ Import the Navbar component

// --- Helper Components ---

const UserDisplay = ({ userId }) => {
    const { data: user, isLoading } = useQuery({
        queryKey: ['user', userId],
        queryFn: () => newRequest.get(`/users/${userId}`).then(res => res.data),
        staleTime: 1000 * 60 * 60, // Cache user data for 1 hour
    });

    if (isLoading) return <div className="h-10 w-24 bg-gray-200 rounded animate-pulse"></div>;

    return (
        <div className="flex items-center">
            <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                {user?.username?.charAt(0).toUpperCase() || "?"}
            </div>
            <div className="ml-4">
                <div className="text-sm font-medium text-gray-900">
                    {user?.username || "N/A"}
                </div>
            </div>
        </div>
    );
};

const ReadStatus = ({ conversation, currentUser }) => {
  if (conversation.lastMessageSenderId !== currentUser._id) {
    return null;
  }
  const isReadByOtherUser = currentUser.isSeller ? conversation.readByBuyer : conversation.readBySeller;
  if (isReadByOtherUser) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 ml-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
        <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
        <path d="M15.828 8.293a1 1 0 010 1.414l-4.242 4.243a1 1 0 01-1.415 0L10 12.828l-1.414 1.414a1 1 0 01-1.414-1.414l2.121-2.121a1 1 0 011.415 0l4.242-4.243a1 1 0 011.414 0z" />
      </svg>
    );
  }
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 ml-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
  );
};

const Messages = () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const queryClient = useQueryClient();

  const { isLoading, error, data } = useQuery({
    queryKey: ["conversations"],
    queryFn: () =>
      newRequest.get(`/conversations`).then((res) => res.data),
  });

  const mutation = useMutation({
    mutationFn: (id) => {
      return newRequest.put(`/conversations/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["conversations"]);
    },
  });

  useEffect(() => {
    if (!currentUser?._id) return;
    const socket = io("http://localhost:4000");
    socket.emit("newUser", currentUser._id);
    socket.on("getMessage", (newMessage) => {
      queryClient.invalidateQueries(["conversations"]);
      const conversation = data?.find(c => c.id === newMessage.conversationId);
      const senderName = conversation?.otherUsername || "Someone";
      toast.custom((t) => (
        <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}>
          <div className="flex-1 w-0 p-4">
            <div className="flex items-start">
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-900">New message from <b>{senderName}</b></p>
                <p className="mt-1 text-sm text-gray-500 truncate">{newMessage.desc}</p>
              </div>
            </div>
          </div>
          <div className="flex border-l border-gray-200">
            <Link to={`/message/${newMessage.conversationId}`} onClick={() => toast.dismiss(t.id)} className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500">
              View
            </Link>
          </div>
        </div>
      ));
    });
    return () => {
      socket.disconnect();
    };
  }, [currentUser, queryClient, data]);

  const handleRead = (id) => {
    mutation.mutate(id);
  };

  if (!currentUser) {
    return <div className="text-center p-10">Please log in to see your messages.</div>;
  }

  return (
    <> 
      <Navbar />
      <div className="bg-gray-100 min-h-screen">
          <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
              <Toaster position="top-center" />
              <h1 className="text-4xl font-extrabold text-gray-900 mb-8">Inbox</h1>
              {isLoading ? (
                  <div className="text-center text-gray-600">Loading conversations...</div>
              ) : error ? (
                  <div className="text-center text-red-600">Error loading conversations.</div>
              ) : (
                  <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                      <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                              <tr>
                                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">{currentUser.isSeller ? "Buyer" : "Seller"}</th>
                                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Last Message</th>
                                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Action</th>
                              </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                              {Array.isArray(data) && data.map((c) => {
                                  if (!c || !c.id) return null;
                                  
                                  const isUnread = (currentUser.isSeller && !c.readBySeller) || (!currentUser.isSeller && !c.readByBuyer);
                                  const otherUserId = currentUser.isSeller ? c.buyerId : c.sellerId;
                                  
                                  return (
                                      <tr
                                          key={c.id}
                                          className={`transition-colors ${isUnread ? "bg-blue-50 font-semibold" : "hover:bg-gray-50"}`}
                                      >
                                          <td className="px-6 py-4 whitespace-nowrap">
                                              <UserDisplay userId={otherUserId} />
                                          </td>
                                          <td className="px-6 py-4 whitespace-nowrap group">
                                              <Link to={`/message/${c.id}`} className="flex items-center justify-between w-full">
                                                  <span className="text-sm text-gray-600 group-hover:text-purple-700 truncate">
                                                      {c.lastMessage ? c.lastMessage : <span className="italic text-gray-500">No messages yet...</span>}
                                                  </span>
                                                  <ReadStatus conversation={c} currentUser={currentUser} />
                                              </Link>
                                          </td>
                                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{moment(c.updatedAt).fromNow()}</td>
                                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                              {isUnread && (
                                                  <button
                                                      onClick={() => handleRead(c.id)}
                                                      className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors text-xs"
                                                  >
                                                      Mark as Read
                                                  </button>
                                              )}
                                          </td>
                                      </tr>
                                  );
                              })}
                          </tbody>
                      </table>
                  </div>
              )}
          </div>
      </div>
    </>
  );
};

export default Messages;