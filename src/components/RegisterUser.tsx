"use client";
import React, { useState, useRef } from "react";

interface RegisterUserProps {}

const RegisterUser: React.FC<RegisterUserProps> = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [uploadUrl, setUploadUrl] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleRegister = async () => {
    const response = await fetch("/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      const data = await response.json();
      setUploadUrl(data.uploadUrl);
      setMessage("User created! Please upload your profile image.");
    } else {
      setMessage("Failed to create user.");
    }
  };

  const handleImageUpload = async () => {
    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      setMessage("Please select a file to upload.");
      return;
    }

    const response = await fetch(uploadUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "image/jpeg",
      },
      body: file,
    });

    if (response.ok) {
      setMessage("Profile image uploaded successfully!");
    } else {
      setMessage("Failed to upload profile image.");
    }
  };

  return (
    <div>
      <h1>Register User</h1>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleRegister}>Register</button>
      {uploadUrl && (
        <div>
          <input type="file" ref={fileInputRef} accept="image/jpeg" />
          <button onClick={handleImageUpload}>Upload Image</button>
        </div>
      )}
      <p>{message}</p>
    </div>
  );
};

export default RegisterUser;
