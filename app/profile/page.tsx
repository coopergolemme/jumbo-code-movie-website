"use client";
import StreamingProviders from "@/components/streaming-providers";
import React, { useState } from "react";

const ProfilePage: React.FC = () => {
  const [providers, setProviders] = useState<string[]>([]);
  const [newProvider, setNewProvider] = useState<string>("");

  const handleAddProvider = () => {
    if (newProvider.trim() && !providers.includes(newProvider)) {
      setProviders([...providers, newProvider]);
      setNewProvider("");
    }
  };

  const handleRemoveProvider = (provider: string) => {
    setProviders(providers.filter((p) => p !== provider));
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Profile Page</h1>
      <h2>Streaming Providers</h2>
      <ul>
        {providers.map((provider, index) => (
          <li
            key={index}
            style={{ marginBottom: "10px" }}>
            {provider}{" "}
            <button
              onClick={() => handleRemoveProvider(provider)}
              style={{ marginLeft: "10px" }}>
              Remove
            </button>
          </li>
        ))}
      </ul>
      <div style={{ marginTop: "20px" }}>
        <StreamingProviders />
      </div>
    </div>
  );
};

export default ProfilePage;
