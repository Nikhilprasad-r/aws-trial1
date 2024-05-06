"use client";
import { useState } from "react";
import { FaUserEdit } from "react-icons/fa";

function UpdateProfilePicture({ username }: { username: string }) {
  const [message, setMessage] = useState("");

  const handleUpdate = async () => {
    const response = await fetch("/api/update-profile", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username }),
    });

    if (response.ok) {
      const data = await response.json();
      setMessage(
        `Upload your new profile image using this URL: ${data.uploadUrl}`
      );
    } else {
      setMessage("Failed to update profile image.");
    }
  };

  return (
    <div>
      <h1>Update Profile Picture</h1>
      <button onClick={handleUpdate}>
        <FaUserEdit />
      </button>
      <p>{message}</p>
    </div>
  );
}

export default UpdateProfilePicture;
