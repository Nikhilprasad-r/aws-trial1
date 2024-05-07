"use client";
import { useState } from "react";
import { FaUserEdit } from "react-icons/fa";
import axios from "axios";

function UpdateProfilePicture({ username }: { username: string }) {
  const [message, setMessage] = useState("");

  const handleUpdate = async () => {
    try {
      const response = await axios.patch("/api/update-profile", { username });
      setMessage(
        `Upload your new profile image using this URL: ${response.data.uploadUrl}`
      );
    } catch (error) {
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
