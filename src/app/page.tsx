import AdminPanel from "@/components/AdminPanel";
import RegisterUser from "@/components/RegisterUser";
import SidePanel from "@/components/SidePanel";

export default function Home() {
  return (
    <div>
      <SidePanel />
      <AdminPanel />
      <RegisterUser />
    </div>
  );
}
