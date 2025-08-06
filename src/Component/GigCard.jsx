import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import newRequest from "../utils/newRequest";

const GigCard = ({ item }) => {
  const { isLoading, error, data: user } = useQuery({
    queryKey: ["user", item.userId],
    queryFn: () => newRequest.get(`users/${item.userId}`).then((res) => res.data),
  });

  const averageRating =
    item.starNumber && item.totalStars
      ? Math.round(item.totalStars / item.starNumber)
      : 0;

  return (
    <Link
      to={`/gig/${item._id}`}
      className="block border rounded-xl overflow-hidden shadow hover:shadow-md transition duration-300 bg-white"
    >
      <img
        src={item.cover || "/img/default-cover.jpg"}
        alt="Gig cover"
        className="w-full h-48 object-cover"
      />

      <div className="p-4">
        {isLoading ? (
          <p className="text-sm text-gray-500">Loading user...</p>
        ) : error ? (
          <p className="text-sm text-red-500">Failed to load user</p>
        ) : (
          <div className="flex items-center gap-2 mb-2">
            <img
              src={user.img || "/img/noavatar.jpg"}
              alt="User"
              className="w-6 h-6 rounded-full"
            />
            <span className="text-sm font-medium">{user.username}</span>
          </div>
        )}

        <p className="text-gray-800 font-semibold mb-1">{item.title}</p>
        <p className="text-gray-600 text-sm mb-2 line-clamp-2">{item.desc}</p>

        <div className="flex items-center gap-1 text-yellow-500 mb-2">
          <img src="/img/star.png" alt="star" className="w-4 h-4" />
          <span className="text-sm">{averageRating}</span>
        </div>

        <div className="flex justify-between items-center border-t pt-2 text-sm text-gray-700">
          <img src="/img/heart.png" alt="like" className="w-4 h-4" />
          <div className="text-right">
            <span className="block text-xs text-gray-400">STARTING AT</span>
            <span className="font-semibold">₹{item.price}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default GigCard;
