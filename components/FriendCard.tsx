import React from "react";
import { MessageCircle, MoreVertical, Users, Clock } from "lucide-react";

interface Friend {
  id: string;
  name: string;
  username: string;
  avatar?: string;
  status: "online" | "offline" | "away";
  lastSeen?: string;
  mutualFriends?: number;
  favoriteGenres?: string[];
  recentActivity?: string;
}

interface FriendCardProps {
  friend: Friend;
  onMessage?: (friendId: string) => void;
  onViewProfile?: (friendId: string) => void;
  onMoreOptions?: (friendId: string) => void;
}

export default function FriendCard({
  friend,
  onMessage,
  onViewProfile,
  onMoreOptions,
}: FriendCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-500";
      case "away":
        return "bg-yellow-500";
      case "offline":
        return "bg-gray-400";
      default:
        return "bg-gray-400";
    }
  };

  const getStatusText = (friend: Friend) => {
    if (friend.status === "online") return "Online";
    if (friend.status === "away") return "Away";
    return friend.lastSeen ? `Last seen ${friend.lastSeen}` : "Offline";
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow">
      {/* Card Header */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                {friend.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </div>
              <div
                className={`absolute -bottom-1 -right-1 w-5 h-5 ${getStatusColor(
                  friend.status
                )} rounded-full border-2 border-white`}></div>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg text-gray-900">{friend.name}</h3>
              <p className="text-gray-500 text-sm">{friend.username}</p>
              <p className="text-gray-400 text-xs mt-1">
                {getStatusText(friend)}
              </p>
            </div>
          </div>
          <button
            onClick={() => onMoreOptions?.(friend.id)}
            className="text-gray-400 hover:text-gray-600 p-1">
            <MoreVertical size={20} />
          </button>
        </div>
      </div>

      {/* Card Content */}
      <div className="px-6 pb-4">
        <div className="space-y-3">
          <div className="flex items-center text-sm text-gray-600">
            <Users
              size={16}
              className="mr-2"
            />
            <span>{friend.mutualFriends} mutual friends</span>
          </div>

          <div className="flex items-center text-sm text-gray-600">
            <Clock
              size={16}
              className="mr-2"
            />
            <span>{friend.recentActivity}</span>
          </div>

          {friend.favoriteGenres && (
            <div className="flex flex-wrap gap-1 mt-2">
              {friend.favoriteGenres.map((genre, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                  {genre}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Card Actions */}
      <div className="px-6 pb-6 flex gap-2">
        <button
          onClick={() => onMessage?.(friend.id)}
          className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
          <MessageCircle size={16} />
          Message
        </button>
        <button
          onClick={() => onViewProfile?.(friend.id)}
          className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium transition-colors">
          View Profile
        </button>
      </div>
    </div>
  );
}
