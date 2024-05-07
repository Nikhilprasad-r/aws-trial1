"use client";
import React, { useState } from "react";
import axios from "axios";

const RegisterUser: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [uploadUrl, setUploadUrl] = useState<string | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [s3Path, setS3Path] = useState<string | null>(null);
  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile = event.target.files ? event.target.files[0] : null;
    setFile(selectedFile);
    if (selectedFile) {
      const fileType = selectedFile.type;
      setIsLoading(true);
      try {
        const response = await axios.get("/api/users/upload-url", {
          headers: { "X-File-Type": encodeURIComponent(fileType) },
        });
        const { s3Path, uploadUrl } = response.data;
        console.log("Got upload URL:", s3Path);
        setUploadUrl(uploadUrl);
        setS3Path(s3Path);
      } catch (error) {
        alert(`Error getting upload URL: ${parseError(error)}`);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleUpload = async () => {
    if (!file || !uploadUrl) {
      alert("File not selected or upload URL not available.");
      return;
    }
    console.log("Uploading with headers:", {
      "Content-Type": file.type,
    });
    console.log("Upload URL:", uploadUrl);
    setIsLoading(true);
    try {
      const response = await axios.put(uploadUrl, file);
      console.log("Upload successful", response);
      setUploadedImageUrl(uploadUrl.split("?")[0]);
      alert("Image uploaded successfully");
    } catch (error) {
      console.error("Upload error", {});
      alert(`Error uploading image: ${parseError(error)}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      await axios.post("/api/users", {
        username,
        password,
        s3Path,
      });
      handleUpload();
      alert("User created successfully!");
    } catch (error) {
      alert(`Error creating user: ${parseError(error)}`);
    } finally {
      setIsLoading(false);
    }
  };

  const parseError = (error: unknown): string => {
    if (axios.isAxiosError(error)) {
      return (
        error.response?.data.message || "An error occurred during the request."
      );
    } else if (error instanceof Error) {
      return error.message;
    }
    return "An unexpected error occurred.";
  };

  return (
    <div className="flex flex-col">
      <input
        type="file"
        onChange={handleFileChange}
        required
        accept=".png , .jpg, .jpeg"
      />

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={username}
          onChange={handleUsernameChange}
          required
          placeholder="Username"
        />
        <input
          type="password"
          value={password}
          onChange={handlePasswordChange}
          required
          placeholder="Password"
        />
        <button type="submit" disabled={isLoading}>
          Create Account
        </button>
      </form>
      {uploadedImageUrl && (
        <div
          style={{
            width: "200px",
            height: "220px",
            overflow: "hidden",
            marginTop: "10px",
          }}
        >
          <img
            src={uploadedImageUrl}
            alt="Uploaded Image"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
      )}
    </div>
  );
};

export default RegisterUser;
