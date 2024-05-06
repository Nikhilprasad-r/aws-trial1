"use client";
import { useEffect, useState } from "react";
interface userData {
  username: string;
  profileImageUrl: string;
}
function UserProfile({ username }: { username: string }) {
  const [user, setUser] = useState<userData | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const response = await fetch(`/api/users/${username}`);
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
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
