"use client";
import React, { useState, useEffect } from "react";
import { Search, UserPlus, Users } from "lucide-react";
import FriendCard from "@/components/FriendCard";

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

export default function FriendsPage() {
  const [friends, setFriends] = useState<Friend[]>([
    {
      id: "1",
      name: "John Doe",
      username: "@johndoe",
      status: "online",
      mutualFriends: 5,
      favoriteGenres: ["Action", "Sci-Fi"],
      recentActivity: "Watched Dune: Part Two",
    },
    {
      id: "2",
      name: "Jane Smith",
      username: "@janesmith",
      status: "away",
      lastSeen: "2 hours ago",
      mutualFriends: 12,
      favoriteGenres: ["Drama", "Romance"],
      recentActivity: "Rated Oppenheimer 5 stars",
    },
    {
      id: "3",
      name: "Mike Johnson",
      username: "@mikej",
      status: "offline",
      lastSeen: "1 day ago",
      mutualFriends: 3,
      favoriteGenres: ["Horror", "Thriller"],
      recentActivity: "Added The Batman to watchlist",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<"all" | "online" | "offline">("all");
  const [showAddFriend, setShowAddFriend] = useState(false);

  const filteredFriends = friends.filter((friend) => {
    const matchesSearch =
      friend.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      friend.username.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filter === "all" ||
      friend.status === filter ||
      (filter === "online" && friend.status !== "offline");
    return matchesSearch && matchesFilter;
  });

  const handleMessage = (friendId: string) => {
    console.log("Messaging friend:", friendId);
    // Add your messaging logic here
  };

  const handleViewProfile = (friendId: string) => {
    console.log("Viewing profile of friend:", friendId);
    // Add your view profile logic here
  };

  const handleMoreOptions = (friendId: string) => {
    console.log("More options for friend:", friendId);
    // Add your more options logic here
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Friends</h1>
          <p className="text-gray-600">
            {friends.length} friends •{" "}
            {friends.filter((f) => f.status === "online").length} online
          </p>
        </div>
        <button
          onClick={() => setShowAddFriend(true)}
          className="mt-4 sm:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center gap-2 font-medium">
          <UserPlus size={20} />
          Add Friend
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search friends..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            {["all", "online", "offline"].map((filterOption) => (
              <button
                key={filterOption}
                onClick={() => setFilter(filterOption as any)}
                className={`px-4 py-2 rounded-lg font-medium capitalize transition-colors ${
                  filter === filterOption
                    ? "bg-blue-100 text-blue-700 border border-blue-200"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}>
                {filterOption}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Friends Grid */}
      {filteredFriends.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredFriends.map((friend) => (
            <FriendCard
              key={friend.id}
              friend={friend}
              onMessage={handleMessage}
              onViewProfile={handleViewProfile}
              onMoreOptions={handleMoreOptions}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Users
            size={48}
            className="mx-auto text-gray-400 mb-4"
          />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No friends found
          </h3>
          <p className="text-gray-500 mb-4">
            {searchTerm
              ? "Try adjusting your search terms"
              : "Start by adding some friends!"}
          </p>
          <button
            onClick={() => setShowAddFriend(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors">
            Add Friend
          </button>
        </div>
      )}

      {/* Add Friend Modal */}
      {showAddFriend && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">Add Friend</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username or Email
                </label>
                <input
                  type="text"
                  placeholder="Enter username or email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowAddFriend(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
                <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Send Request
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
