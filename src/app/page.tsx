import RegisterUser from "@/components/RegisterUser";
import UpdateProfilePicture from "@/components/UpdateProfilePicture";
import UserProfile from "@/components/UserProfile";

export default function Home() {
  return (
    <div>
      <UserProfile username="alice" />
      <UpdateProfilePicture username="alice" />
    </div>
  );
}
