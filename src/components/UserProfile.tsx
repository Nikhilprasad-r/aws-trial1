"use client";
import { useEffect, useState } from "react";
import axios from "axios";

interface userData {
  username: string;
  profileImageUrl: string;
}

function UserProfile({ username }: { username: string }) {
  const [user, setUser] = useState<userData | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`/api/users/${username}`);
        setUser(response.data.user);
      } catch (error) {
        setUser(null);
      }
    };

    fetchUser();
  }, [username]);

  return (
    <div>
      <h1>User Profile</h1>
      {user ? (
        <div>
          <p>Username: {user.username}</p>
          <img src={user.profileImageUrl} alt="Profile" />
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default UserProfile;
